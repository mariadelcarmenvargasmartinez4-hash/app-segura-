import { Module } from '@nestjs/common';
import { homeworkController } from './homework.controlles';
import { homeworkService } from './homework.service';

@Module({
 //  imports: [],
  controllers: [ homeworkController ],
    providers: [homeworkService ],
})
export class homeworkModule {}
exports: [homeworkService]