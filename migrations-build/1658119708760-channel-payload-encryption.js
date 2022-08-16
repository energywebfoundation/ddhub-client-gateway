"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channelPayloadEncryption1658119708760 = void 0;
class channelPayloadEncryption1658119708760 {
    async up(queryRunner) {
        await queryRunner.query('ALTER TABLE public.channels ALTER COLUMN "payloadEncryption" DROP NOT NULL');
    }
    async down(queryRunner) {
        await queryRunner.query('ALTER TABLE public.channels ALTER COLUMN "payloadEncryption" SET NOT NULL');
    }
}
exports.channelPayloadEncryption1658119708760 = channelPayloadEncryption1658119708760;
