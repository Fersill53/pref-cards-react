// Returns a copy of list with the item at index moved by dir (-1 up, +1 down).
export function moveItem(list, index, dir) {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
