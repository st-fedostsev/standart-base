import type { SxProps, Theme } from '@mui/material';

/** Наведение и фокус с клавиатуры: нейтральный серый. */
const MENU_HOVER_BG = 'grey.300';
const MENU_SELECTED_BG = 'white';
const MENU_SELECTED_TEXT = 'black';
/** Отступ текста в полном меню, единицы spacing: 2 = 16px. Менять только здесь. */
export const MENU_ITEM_PX = 2;

/** Отступ в полосе иконок: иконка 24px встаёт по центру полосы 64px. */
export const RAIL_ITEM_PX = 1.5;

const itemBase = {
  borderRadius: 1,
  '& .MuiListItemIcon-root': { minWidth: 36, flexShrink: 0 },
  // Наведение только на устройствах с мышью, чтобы на телефоне подсветка не залипала
  '@media (hover: hover)': {
    '&:hover': { bgcolor: MENU_HOVER_BG },
  },
  '&.Mui-focusVisible': { bgcolor: MENU_HOVER_BG },
  // Блок выбранного стоит последним и имеет более высокую специфичность, чем :hover,
  // поэтому выбранный пункт при наведении не становится серым
  '&.Mui-selected, &.Mui-selected:hover': {
    bgcolor: MENU_SELECTED_BG,
    color: MENU_SELECTED_TEXT,
    '& .MuiListItemText-primary': { fontWeight: 600 },
  },
} as const;

/** Пункт полного меню, строка пользователя и пункты попапа. */
export const menuItemSx = { ...itemBase, px: MENU_ITEM_PX } as const;

/** Пункт полосы иконок. Цвета те же, отступ другой. */
export const railItemSx = { ...itemBase, px: RAIL_ITEM_PX } as const;

/**
 * Подпись: в полном меню видна всегда, в полосе иконок появляется при
 * раскрытии. Текст остаётся в DOM, поэтому доступен скринридерам.
 */
export const revealSx = (visible: boolean) =>
  ({
    minWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    opacity: visible ? 1 : 0,
    transition: visible ? 'opacity 200ms ease 80ms' : 'opacity 100ms ease',
  }) as const;

/**
 * Линия-разделитель внутри меню. Отступ 8px по бокам совпадает с отступом
 * пунктов.
 */
export const menuDividerSx: SxProps<Theme> = {
  height: '1px',
  border: 'none',
  background: 'var(--k-color-line-neutral-faint, rgba(0, 0, 0, 0.08))',
  margin: '4px 8px',
};
