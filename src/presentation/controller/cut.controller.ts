import {
  Res,
  Body,
  Post,
  UsePipes,
  Controller,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CutService } from 'src/application/cut.service';
import { CutRequest } from 'src/presentation/request/Cut';
import { CutResponse } from 'src/presentation/response/Cut';

@Controller('cut')
export class CutController {
  constructor(private readonly service: CutService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  public async cut(
    @Body() req: CutRequest,
    @Res() res: Response,
  ): Promise<void> {
    try {
      let cutVideoSrc: string;
      const mlProcess = this.service.cut(
        req.videoUrl,
        req.filterType,
        req.filter,
      );
      mlProcess.stdout.on('data', chunk => {
        cutVideoSrc = chunk.toString();
      });
      mlProcess.stderr.on('data', error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      });
      mlProcess.on('close', code => {
        console.log(`child process exited with code: ${code}`);
        const result = new CutResponse(cutVideoSrc);
        res.status(HttpStatus.OK).json(result);
      });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
