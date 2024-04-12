import { ResourceCountVO } from '../../@core/data/base-data';

export function countResource<T extends ResourceCountVO>(param: T): number {
  // 从对象转为 Map ：new Map(Object.entries(obj))
  // 从 Map 转为对象：Object.fromEntries(map.entries())
  const map = new Map(Object.entries(param.resourceCount));
  let sum: number = 0;
  map.forEach((key, value) => {
    sum = sum + key;
  });
  return sum;
}

export function parseResourceCount<T extends ResourceCountVO>(param: T): boolean {
  let sum = countResource(param);
  return sum > 0;
}

export function getResourceCountColor<T extends ResourceCountVO>(param: T): string {
  let flag = parseResourceCount(param);
  return flag ? 'var(--devui-warning)' : 'var(--devui-waiting)';
}
