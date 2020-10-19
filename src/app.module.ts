import { Module } from '@nestjs/common';
import { CutService } from 'src/application/cut.service';
import { CutController } from 'src/presentation/controller/cut.controller';
import { VideoPlayerController } from 'src/presentation/controller/video-player.controller';

@Module({
  imports: [],
  controllers: [CutController, VideoPlayerController],
  providers: [CutService],
})
export class BlablaCutAppModule {}
