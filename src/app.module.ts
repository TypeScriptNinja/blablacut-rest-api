import { Module } from '@nestjs/common';
import { CutService } from 'src/application/cut.service';
import { CutController } from 'src/presentation/controller/cut.controller';

@Module({
  imports: [],
  controllers: [CutController],
  providers: [CutService],
})
export class BlablaCutAppModule {}
