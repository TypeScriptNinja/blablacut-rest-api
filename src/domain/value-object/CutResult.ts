import { CutResultStatus } from 'src/domain/enum/CutResultStatus';

export type CutResult = {
  status: CutResultStatus;
  data: string;
};
