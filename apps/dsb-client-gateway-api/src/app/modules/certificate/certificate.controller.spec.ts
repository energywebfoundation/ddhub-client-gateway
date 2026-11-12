import { BadRequestException } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './service/certificate.service';
import { UploadCertificateBodyDto } from './dto/request/upload-certificates-body.dto';

const mockCertificateService = {
  save: jest.fn(),
};

const file = (content: string) =>
  ({ buffer: Buffer.from(content) } as Express.Multer.File);

describe('CertificateController', () => {
  let controller: CertificateController;
  let error: Error | null;

  beforeEach(() => {
    jest.resetAllMocks();

    error = null;

    controller = new CertificateController(
      mockCertificateService as unknown as CertificateService
    );
  });

  describe('save()', () => {
    describe('should save certificate without caCertificate', () => {
      beforeEach(async () => {
        try {
          await controller.save(
            { certificate: [file('1')], privateKey: [file('2')] },
            new UploadCertificateBodyDto()
          );
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should pass the uploaded files to the service', () => {
        expect(mockCertificateService.save).toBeCalledWith(
          file('1'),
          file('2'),
          undefined
        );
      });
    });

    describe('should save certificate with caCertificate', () => {
      beforeEach(async () => {
        try {
          await controller.save(
            {
              certificate: [file('1')],
              privateKey: [file('2')],
              caCertificate: [file('3')],
            },
            new UploadCertificateBodyDto()
          );
        } catch (e) {
          error = e;
        }
      });

      it('should execute', () => {
        expect(error).toBeNull();
      });

      it('should pass the single caCertificate file to the service', () => {
        expect(mockCertificateService.save).toBeCalledWith(
          file('1'),
          file('2'),
          file('3')
        );
      });
    });

    describe('should reject when certificate is missing', () => {
      beforeEach(async () => {
        try {
          await controller.save(
            { privateKey: [file('2')] },
            new UploadCertificateBodyDto()
          );
        } catch (e) {
          error = e;
        }
      });

      it('should throw BadRequestException', () => {
        expect(error).toBeInstanceOf(BadRequestException);
      });

      it('should not call the service', () => {
        expect(mockCertificateService.save).not.toBeCalled();
      });
    });

    describe('should reject when privateKey is missing', () => {
      beforeEach(async () => {
        try {
          await controller.save(
            { certificate: [file('1')] },
            new UploadCertificateBodyDto()
          );
        } catch (e) {
          error = e;
        }
      });

      it('should throw BadRequestException', () => {
        expect(error).toBeInstanceOf(BadRequestException);
      });

      it('should not call the service', () => {
        expect(mockCertificateService.save).not.toBeCalled();
      });
    });
  });
});
