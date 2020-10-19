import { resolve } from 'path';
import { createReadStream, statSync } from 'fs';
import { Request, Response } from 'express';
import { Res, Req, Get, Controller, Logger, HttpStatus } from '@nestjs/common';

@Controller('player')
export class VideoPlayerController {
  private static DIR: string = resolve(
    __dirname,
    `../../video_cutter/web_cutter/player`,
  );

  @Get('*')
  public stream(@Req() req: Request, @Res() res: Response): void {
    try {
      const { headers, url } = req;
      const i = url.lastIndexOf('/');
      const path = VideoPlayerController.DIR + url.substring(i);
      const { size } = statSync(path);
      const range = headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
        const chunksize = end - start + 1;

        const stream = createReadStream(path, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        });

        stream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': size,
          'Content-Type': 'video/mp4',
        });
        createReadStream(path).pipe(res);
      }
    } catch (e) {
      const status = e.message ?? e;
      Logger.error(`INTERNAL_SERVER_ERROR: ${status}`, e.stack);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(status);
    }
  }
}
