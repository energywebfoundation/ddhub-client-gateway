// import { Injectable } from '@nestjs/common';
// import { FileMetadataEntity } from '@dsb-client-gateway/dsb-client-gateway-storage';
// import { MessageSignatureNotValidException } from '../../../../../apps/dsb-client-gateway-api/src/app/modules/message/exceptions/messages-signature-not-valid.exception';
// import { DownloadMessageResponse } from '@dsb-client-gateway/ddhub-client-gateway-message-broker';
//
// @Injectable()
// export class FileDownloadHelperService {
//   public async getFile(): Promise<DownloadMessageResponse> {
//     const fileMetadata: FileMetadataEntity =
//       await this.fileHelperService.createMetadata(fileId);
//
//     const isSignatureValid: boolean =
//       await this.rsaEncryptionService.verifySignature(
//         fileMetadata.did,
//         fileMetadata.signature,
//         await this.rsaEncryptionService.checksumFile(fileMetadata.path)
//       );
//
//     if (!isSignatureValid) {
//       throw new MessageSignatureNotValidException(
//         fileId,
//         fileMetadata.signature
//       );
//     }
//   }
// }
