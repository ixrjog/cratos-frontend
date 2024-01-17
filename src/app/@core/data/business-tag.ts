import { TagVo } from './tag';

export interface BusinessTag {
  id: number;
  businessType: string;
  businessId: number;
  tagId: number;
  tagValue: string;
  tag: TagVo;
}
