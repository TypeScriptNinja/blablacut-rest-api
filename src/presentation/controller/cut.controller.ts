import {
  Res,
  Body,
  Post,
  Logger,
  UsePipes,
  Controller,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CutResult } from 'src/domain/value-object/CutResult';
import { CutResultStatus } from 'src/domain/enum/CutResultStatus';
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
      let cutResult: string;
      const mlProcess = this.service.cut(
        req.videoUrl,
        req.filterType,
        req.filter,
      );
      mlProcess.stdout.on('data', chunk => {
        cutResult = chunk.toString();
        Logger.log(`CutResult: ${cutResult}`);
      });
      mlProcess.stderr.on('data', error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      });
      mlProcess.on('close', code => {
        if (code === 0) {
          const { status, data } = JSON.parse(cutResult) as CutResult;
          if (status === CutResultStatus.SUCCESS) {
            const result = new CutResponse(data);
            res.status(HttpStatus.OK).json(result);
          } else {
            res.status(HttpStatus.NOT_FOUND).json({ status });
          }
        } else {
          Logger.warn(`ML process exited with code: ${code}`);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ code });
        }
      });
      mlProcess.on('error', ({ message, stack }) => {
        Logger.error(`ML process error: ${message}`, stack);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
      });
    } catch ({ message, stack }) {
      Logger.error(`INTERNAL_SERVER_ERROR: ${message}`, stack);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  }
}
