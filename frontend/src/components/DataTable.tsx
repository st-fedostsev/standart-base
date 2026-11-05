import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

import { RowKebab } from '@/components/RowKebab';

import type { ActionItem } from '@/utils/types/actions';

import {
  Box,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';

export type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
  /** Значение для сортировки. Не задано: колонка не сортируется. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
};

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

/** Что таблица передаёт в панель массовых действий. */
export type MassActionsContext = {
  /** Сколько строк выбрано. */
  count: number;
  /** Выбрать все видимые строки. */
  selectAll: () => void;
  /** Снять выбор. */
  clear: () => void;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /**
   * Выбранные id. Чекбоксы появляются, только если заданы selectedIds,
   * onSelectedIdsChange и massActionsPanel.
   */
  selectedIds?: ReadonlySet<string>;
  onSelectedIdsChange?: (ids: Set<string>) => void;
  /**
   * Панель массовых действий. Выводится внизу, пока выбрана хотя бы одна
   * строка.
   */
  massActionsPanel?: (ctx: MassActionsContext) => ReactNode;
  /**
   * Меню справа в строке. Не задано: колонки нет. Пустой список для строки:
   * кнопки нет.
   */
  kebabMenu?: (row: T) => ActionItem[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  errorText?: string;
  /**
   * Показывается вместо таблицы, когда строк нет и данные загружены (обычно
   * EmptyState)
   */
  empty?: ReactNode;
  /** Префикс data-tid. На tbody ставится состояние: -loading, -error или -data. */
  dataTid?: string;
};

const SKELETON_ROWS = 5;
/** Запас под фиксированную панель, чтобы она не закрывала последнюю строку. */
const PANEL_SPACER_PX = 96;
const KEBAB_COLUMN_WIDTH = 56;

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'ru');
}

/** Двухстрочная ячейка: основной текст и пояснение под ним. */
export function CellLines({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <>
      <Typography variant='body2'>{primary}</Typography>
      {secondary && (
        <Typography
          variant='caption'
          sx={{ color: 'text.secondary', display: 'block' }}
        >
          {secondary}
        </Typography>
      )}
    </>
  );
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedIds,
  onSelectedIdsChange,
  massActionsPanel,
  kebabMenu,
  onRowClick,
  isLoading = false,
  errorText,
  empty,
  dataTid = 'data-table',
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  // Чекбоксы выводятся только если передана панель массовых действий
  const selectable =
    selectedIds !== undefined &&
    onSelectedIdsChange !== undefined &&
    massActionsPanel !== undefined;
  const columnCount =
    columns.length + (selectable ? 1 : 0) + (kebabMenu ? 1 : 0);
  const state = isLoading
    ? 'loading'
    : errorText
      ? 'error'
      : rows.length === 0
        ? 'empty'
        : 'data';

  const sortedRows = useMemo(() => {
    const column = columns.find((c) => c.key === sort?.key);
    const getValue = column?.sortValue;
    if (!sort || !getValue) return rows;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => compareValues(getValue(a), getValue(b)) * factor
    );
  }, [rows, columns, sort]);

  // Клик по заголовку: по возрастанию, затем по убыванию
  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );

  // Чекбокс в шапке работает с видимыми строками
  const visibleIds = rows.map(getRowId);
  const visibleSelected = visibleIds.filter((id) =>
    selectedIds?.has(id)
  ).length;
  const allSelected = rows.length > 0 && visibleSelected === rows.length;
  const someSelected = visibleSelected > 0 && !allSelected;
  // Всего выбрано, включая строки, которых сейчас не видно
  const totalSelected = selectedIds?.size ?? 0;

  const toggleAll = () => {
    if (!onSelectedIdsChange) return;
    onSelectedIdsChange(allSelected ? new Set() : new Set(visibleIds));
  };

  const toggleOne = (id: string) => {
    if (!selectedIds || !onSelectedIdsChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedIdsChange(next);
  };

  // Таблица знает выбор, страница получает готовые функции
  const panelContext: MassActionsContext = {
    count: totalSelected,
    selectAll: () => onSelectedIdsChange?.(new Set(visibleIds)),
    clear: () => onSelectedIdsChange?.(new Set()),
  };

  const handleRowKeyDown =
    (row: T) => (e: KeyboardEvent<HTMLTableRowElement>) => {
      // Enter из чекбокса или кнопки внутри строки не открывает карточку
      if (e.target !== e.currentTarget) return;
      if (e.key === 'Enter' && onRowClick) onRowClick(row);
    };

  // Строк нет и данные загружены: вместо таблицы показываем пустое состояние
  if (state === 'empty' && empty) return <>{empty}</>;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    disabled={rows.length === 0}
                    slotProps={{
                      input: { 'aria-label': 'Выбрать все строки' },
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => {
                const current = sort?.key === column.key ? sort : null;
                return (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    sortDirection={current ? current.dir : false}
                    sx={{
                      width: column.width,
                      color: 'text.secondary',
                      fontWeight: 600,
                    }}
                  >
                    {column.sortValue ? (
                      <TableSortLabel
                        active={current !== null}
                        direction={current?.dir ?? 'asc'}
                        onClick={() => toggleSort(column.key)}
                      >
                        {column.title}
                      </TableSortLabel>
                    ) : (
                      column.title
                    )}
                  </TableCell>
                );
              })}
              {kebabMenu && <TableCell sx={{ width: KEBAB_COLUMN_WIDTH }} />}
            </TableRow>
          </TableHead>

          <TableBody data-tid={`${dataTid}-${state}`}>
            {state === 'loading' &&
              Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <TableRow key={i}>
                  {selectable && <TableCell padding='checkbox' />}
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton variant='text' />
                    </TableCell>
                  ))}
                  {kebabMenu && <TableCell />}
                </TableRow>
              ))}

            {state === 'error' && (
              <TableRow>
                <TableCell colSpan={columnCount} align='center' sx={{ py: 6 }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {errorText}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {state === 'data' &&
              sortedRows.map((row) => {
                const id = getRowId(row);
                const isSelected = selectedIds?.has(id) ?? false;
                return (
                  <TableRow
                    key={id}
                    hover
                    selected={isSelected}
                    tabIndex={onRowClick ? 0 : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={onRowClick ? handleRowKeyDown(row) : undefined}
                    sx={
                      onRowClick
                        ? {
                            cursor: 'pointer',
                            '&:focus-visible': {
                              outline: '2px solid',
                              outlineColor: 'primary.main',
                              outlineOffset: -2,
                            },
                          }
                        : undefined
                    }
                  >
                    {selectable && (
                      // Клик по чекбоксу не срабатывает как клик по строке
                      <TableCell
                        padding='checkbox'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleOne(id)}
                          slotProps={{
                            input: { 'aria-label': 'Выбрать строку' },
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                    {kebabMenu && (
                      <TableCell
                        align='right'
                        sx={{ width: KEBAB_COLUMN_WIDTH, py: 0 }}
                      >
                        <RowKebab actions={kebabMenu(row)} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectable && massActionsPanel && totalSelected > 0 && (
        <>
          <Box sx={{ height: PANEL_SPACER_PX }} />
          {massActionsPanel(panelContext)}
        </>
      )}
    </>
  );
}
