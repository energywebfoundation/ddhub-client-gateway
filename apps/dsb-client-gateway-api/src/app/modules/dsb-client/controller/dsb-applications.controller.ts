import { Controller, Get, UseGuards, Body, Post, Patch, HttpStatus, Query, Param } from '@nestjs/common';
import { DsbApiService } from '../service/dsb-api.service';
import { DigestGuard } from '../../utils/guards/digest.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplicationDTO } from '../dsb-client.interface';
import { GetApplicationsQueryDto } from '../dto';

@Controller('dsb')
@UseGuards(DigestGuard)
@ApiTags('applications', 'dsb')

export class DsbApplicationsController {
    constructor(protected readonly dsbClientService: DsbApiService) { }

    @Get('applications')
    @ApiOperation({
        description: 'Gets Applications',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationDTO,
        description: 'List of applications',
    })
    public async getApplications(
        @Query() { ownerDid }: GetApplicationsQueryDto
    ) {
        return this.dsbClientService.getApplicationsByOwner(ownerDid);
    }
}
