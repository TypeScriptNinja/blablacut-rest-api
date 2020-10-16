import { IsUrl, IsNotEmpty } from 'class-validator';
import { FilterType } from 'src/domain/enum/FilterType';

export class CutRequest {
  @IsUrl()
  public readonly videoUrl: string;

  @IsNotEmpty()
  public readonly filterType: FilterType;

  @IsNotEmpty()
  public readonly filter: string;
}
