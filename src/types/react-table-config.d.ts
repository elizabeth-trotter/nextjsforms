// types/react-table-config.d.ts
import 'react-table';

declare module 'react-table' {
  export interface TableOptions<D extends object> extends UseTableOptions<D>, UseSortByOptions<D> {}

  export interface TableInstance<D extends object> extends UseTableInstanceProps<D>, UseSortByInstanceProps<D> {}

  export interface TableState<D extends object> extends UseTableState<D>, UseSortByState<D> {}

  export interface ColumnInterface<D extends object = {}> extends UseSortByColumnOptions<D> {}

  export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
}
