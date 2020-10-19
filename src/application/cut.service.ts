import { spawn } from 'child_process';
import { resolve as resolvePath } from 'path';
import { Injectable } from '@nestjs/common';
import { FilterType } from 'src/domain/enum/FilterType';
import { CutResult } from 'src/domain/value-object/CutResult';

@Injectable()
export class CutService {
  public async cut(videoUrl: string, filterType: FilterType, filter: string) {
    return new Promise<CutResult>(function(resolve, reject) {
      let cutResult: CutResult;

      const cb = (code: number): void =>
        code !== 0
          ? reject(new Error(`ML process exit with ${code} code.`))
          : resolve(cutResult);

      const mlProcess = spawn(
        resolvePath(__dirname, `../${process.env.bbc_python_path}`),
        [
          resolvePath(
            __dirname,
            `../${process.env.bbc_video_cutter_path}/web_cutter/cut.py`,
          ),
          videoUrl,
          filterType,
          filter,
        ],
      );

      mlProcess.stderr.on('data', e => reject(e.toString()));
      mlProcess.stdout.on('data', chunk => {
        cutResult = JSON.parse(chunk.toString());
      });
      mlProcess.on('exit', cb);
      mlProcess.on('close', cb);
      mlProcess.on('error', reject);
    });
  }
}
