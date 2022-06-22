import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsEntity } from './entity/events.entity';
import { EventsRepository } from './repository/events.repository';
import { EventsWrapperRepository } from './wrapper/events-wrapper-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventsEntity, EventsRepository])],
  providers: [EventsWrapperRepository],
  exports: [EventsWrapperRepository],
})
export class EventsRepositoryModule {}
