import { useState, type SyntheticEvent } from 'react';

import { useCurrentRole } from '@/utils/hooks/useCurrentRole';
import type { ActionItem } from '@/utils/types/actions';
import { hasAccess } from '@/utils/types/roles';

import MoreVert from '@mui/icons-material/MoreVert';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

type RowKebabProps = {
  actions: ActionItem[];
  label?: string;
};

/**
 * Кнопка «⋮» в строке таблицы. Не выводится, если по роли не видно ни одного
 * пункта. Клики внутри не доходят до строки, иначе открылась бы карточка.
 */
export function RowKebab({
  actions,
  label = 'Действия со строкой',
}: RowKebabProps) {
  const role = useCurrentRole();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const visible = actions.filter((action) => hasAccess(role, action.roles));
  if (visible.length === 0) return null;

  // Меню рисуется порталом, но React-события всплывают по дереву компонентов, поэтому останавливаем их здесь
  const stop = (e: SyntheticEvent) => e.stopPropagation();
  const close = () => setAnchor(null);

  return (
    <Box onClick={stop} onKeyDown={stop} sx={{ display: 'inline-flex' }}>
      <IconButton
        aria-label={label}
        aria-haspopup='menu'
        aria-expanded={Boolean(anchor)}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <MoreVert fontSize='small' />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {visible.map((action) => {
          const Icon = action.icon;
          const color = action.danger ? 'error.main' : undefined;
          return (
            <MenuItem
              key={action.id}
              disabled={action.disabled}
              sx={{ color }}
              onClick={() => {
                close();
                action.onClick();
              }}
            >
              {Icon && (
                <ListItemIcon sx={{ color }}>
                  <Icon fontSize='small' />
                </ListItemIcon>
              )}
              <ListItemText primary={action.label} />
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
