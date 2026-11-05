import type { ElementType } from 'react';

import type { Role } from '@/utils/types/roles';

type NavItemBase = {
  /** Уникальный ключ для списка. */
  id: string;
  /** Подпись в меню. */
  label: string;
  /** Компонент иконки, обязателен. */
  icon: ElementType;
  /** Роли, которые видят пункт. Не задано: все. Пустой список: никто. */
  roles?: readonly Role[];
};

/** Маршрут приложения, открывается в той же вкладке. */
type InternalItem = NavItemBase & { to: string; href?: never };

/** Внешняя ссылка, открывается в новой вкладке. */
type ExternalItem = NavItemBase & { href: string; to?: never };

export type NavItem = InternalItem | ExternalItem;

/** Внешняя ссылка: у таких пунктов задан href. */
export function isExternalItem(item: NavItem): item is ExternalItem {
  return typeof item.href === 'string';
}
