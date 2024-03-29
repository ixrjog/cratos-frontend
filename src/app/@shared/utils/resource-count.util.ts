export function parseResourceCount(resourceCount: Map<string, number>): boolean {
  // 从对象转为 Map ：new Map(Object.entries(obj))
  // 从 Map 转为对象：Object.fromEntries(map.entries())
  const map = new Map(Object.entries(resourceCount));
  let sum: number = 0;
  map.forEach((key, value) => {
    sum = sum + key;
  });
  return sum > 0;
}

export function getResourceCountColor(resourceCount: Map<string, number>): string {
  let flag = parseResourceCount(resourceCount);
  return flag ? 'var(--devui-warning)' : 'var(--devui-waiting)';
}
