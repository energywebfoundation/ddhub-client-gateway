import { Controller, UseGuards } from '@nestjs/common';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('dsb')
@ApiTags('files', 'dsb')
@UseGuards(DigestGuard)
export class DsbFilesController {}
