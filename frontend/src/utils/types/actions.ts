import type { ElementType } from 'react';

import type { Role } from '@/utils/types/roles';

/** Действие: кнопка панели, пункт массового меню или пункт меню строки. */
export type ActionItem = {
  id: string;
  label: string;
  icon?: ElementType;
  onClick: () => void;
  disabled?: boolean;
  /** Красный цвет для необратимых действий. */
  danger?: boolean;
  /** Роли, которые видят действие. Не задано: все. */
  roles?: readonly Role[];
};
