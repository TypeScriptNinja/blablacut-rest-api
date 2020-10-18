import { resolve } from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { FilterType } from 'src/domain/enum/FilterType';

@Injectable()
export class CutService {
  public cut(
    videoUrl: string,
    filterType: FilterType,
    filter: string,
  ): ChildProcessWithoutNullStreams {
    return spawn('python', [
      resolve(__dirname, '../video_cutter/web_cutter/cut.py'),
      videoUrl,
      filterType,
      filter,
    ]);
  }
}
