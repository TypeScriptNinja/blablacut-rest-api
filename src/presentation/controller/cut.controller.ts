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
      const result = await this.service.cut(
        req.videoUrl,
        req.filterType,
        req.filter,
      );
      const { status, data } = result;
      if (status === CutResultStatus.SUCCESS) {
        res.status(HttpStatus.OK).json(new CutResponse(data));
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ status });
      }
    } catch (e) {
      const msg = e.message ?? e;
      Logger.error(`INTERNAL_SERVER_ERROR: ${msg}`, e.stack);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg });
    }
  }
}
