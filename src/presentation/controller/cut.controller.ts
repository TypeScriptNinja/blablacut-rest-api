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
      let cutResult: CutResult;
      const mlProcess = this.service.cut(
        req.videoUrl,
        req.filterType,
        req.filter,
      );
      mlProcess.stdout.on('data', chunk => {
        cutResult = JSON.parse(chunk.toString());
      });
      mlProcess.stderr.on('data', error => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      });
      mlProcess.on('close', code => {
        console.log(`ml process exited with code: ${code}`);
        if (code === 0) {
          const { status, data } = cutResult;
          if (status === CutResultStatus.SUCCESS) {
            const result = new CutResponse(data);
            res.status(HttpStatus.OK).json(result);
          } else {
            res.status(HttpStatus.NOT_FOUND).json({ status });
          }
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });
      mlProcess.on('error', error => {
        console.log(`ml process error: ${error.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
