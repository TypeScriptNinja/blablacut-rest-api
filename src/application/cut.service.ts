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
    return spawn(process.env.python_path, [
      resolve(
        __dirname,
        `../${process.env.video_cutter_path}/web_cutter/cut.py`,
      ),
      videoUrl,
      filterType,
      filter,
    ]);
  }
}
