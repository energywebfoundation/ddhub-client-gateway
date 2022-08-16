import { Injectable } from '@nestjs/common';
import {
  FileMetadataEntity,
  FileMetadataWrapperRepository,
} from '@dsb-client-gateway/dsb-client-gateway-storage';
import { join } from 'path';
import fs from 'fs';
import { DdhubFilesService } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
import { ConfigService } from '@nestjs/config';
import { MessageSignatureNotValidException } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/exceptions/messages-signature-not-valid.exception';
import { SignatureService } from './signature.service';

@Injectable()
export class FileHelperService {
  protected readonly uploadPath: string;
  protected readonly downloadPath: string;
  protected readonly ext: string = '.enc';

  constructor(
    protected readonly configService: ConfigService,
    protected readonly ddhubFilesService: DdhubFilesService,
    protected readonly fileMetadataWrapper: FileMetadataWrapperRepository,
    protected readonly signatureService: SignatureService
  ) {
    this.uploadPath = configService.get<string>('UPLOAD_FILES_DIR');
    this.downloadPath = configService.get<string>('DOWNLOAD_FILES_DIR');
  }

  public async validateFileSignature(
    fileMetadata: FileMetadataEntity
  ): Promise<void> {
    const isSignatureValid: boolean =
      await this.signatureService.verifySignature(
        fileMetadata.did,
        fileMetadata.signature,
        await this.signatureService.checksumFile(fileMetadata.path)
      );

    if (!isSignatureValid) {
      throw new MessageSignatureNotValidException(
        fileMetadata.fileId,
        fileMetadata.signature
      );
    }
  }

  public async createMetadata(fileId: string): Promise<FileMetadataEntity> {
    const fileMetadata: FileMetadataEntity | null = await this.getFileMetadata(
      fileId
    );

    const path: string = join(this.downloadPath, fileId + this.ext);

    if (fileMetadata) {
      return fileMetadata;
    }

    const { headers, data } = await this.ddhubFilesService.downloadFile(fileId);

    const writeStream: fs.WriteStream = fs.createWriteStream(path);

    const writeFilePromise = () => {
      data.pipe(writeStream);

      return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
          resolve(null);
        });

        writeStream.on('error', reject);
      });
    };

    await writeFilePromise();

    const encryptionEnabled: boolean = headers.payloadencryption === 'true';

    return this.fileMetadataWrapper.repository.save({
      clientGatewayMessageId: headers.clientgatewaymessageid,
      signature: headers.signature,
      did: headers.ownerdid,
      fileId,
      encrypted: encryptionEnabled,
      path,
    });
  }

  public async storeNotEncryptedFileForUpload(
    clientGatewayMessageId: string,
    file: Express.Multer.File
  ): Promise<string> {
    const filePath = join(this.uploadPath, clientGatewayMessageId + this.ext);

    const stream = fs.createWriteStream(filePath);

    const writeStream = file.stream.pipe(stream);

    const promise = () =>
      new Promise((resolve) => {
        writeStream.on('finish', () => resolve(null));
      });

    await promise();

    return filePath;
  }

  public async getFileMetadata(
    fileId: string
  ): Promise<FileMetadataEntity | null> {
    const fileMetadata: FileMetadataEntity | null =
      await this.fileMetadataWrapper.repository.findOne({
        where: {
          fileId,
        },
      });

    if (fileMetadata) {
      const fullPath = join(this.downloadPath, fileId + this.ext);

      const existsInStorage: boolean = fs.existsSync(fullPath);

      if (!existsInStorage) {
        await this.fileMetadataWrapper.repository.delete({
          fileId,
        });

        return null;
      }

      return fileMetadata;
    }

    return null;
  }
}
