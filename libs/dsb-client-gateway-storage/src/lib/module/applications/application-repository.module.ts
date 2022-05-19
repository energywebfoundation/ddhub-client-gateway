import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entity/application.entity';
import { ApplicationRepository } from './repository/application.repository';
import { ApplicationWrapperRepository } from './wrapper/application-wrapper.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity, ApplicationRepository]),
  ],
  providers: [ApplicationWrapperRepository],
  exports: [ApplicationWrapperRepository],
})
export class ApplicationRepositoryModule {}
