import { matchSorter } from 'match-sorter';

export const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, {keys: [(row) => row.values[id]]});
}

fuzzyTextFilterFn.autoRemove = (val) => !val;
