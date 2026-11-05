import { useState } from 'react';

import { menuDividerSx, menuItemSx, railItemSx, revealSx } from './menuItemSx';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/utils/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/types/roles';

import {
  Avatar,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

type UserMenuProps = {
  /** Полоса иконок: строка занимает 64px. */
  rail: boolean;
  /** Подписи видны. В полосе иконок только при раскрытии. */
  expanded: boolean;
  /** Ширина попапа в px. Задаёт Menu, строку пользователя не измеряем. */
  popupWidth: number;
};

export function UserMenu({ rail, expanded, popupWidth }: UserMenuProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchor);

  const close = () => setAnchor(null);

  const initials = user
    ? `${user.lastName.charAt(0)}${user.firstName.charAt(0)}`
    : undefined;
  const name = user ? `${user.lastName} ${user.firstName.charAt(0)}.` : 'Гость';
  const role = user ? ROLE_LABELS[user.role] : 'Не вошли';

  const items = user
    ? [
        <MenuItem
          key='profile'
          sx={menuItemSx}
          onClick={() => {
            close();
            navigate('/profile');
          }}
        >
          Личный кабинет
        </MenuItem>,
        <Divider key='divider' sx={menuDividerSx} />,
        <MenuItem
          key='logout'
          sx={menuItemSx}
          onClick={async () => {
            close();
            try {
              await logout();
            } catch {
              // На клиенте пользователь уже гость, AuthProvider сбросил его в finally
            }
            navigate('/');
          }}
        >
          Выйти
        </MenuItem>,
      ]
    : [
        <MenuItem
          key='login'
          sx={menuItemSx}
          onClick={() => {
            close();
            navigate('/login');
          }}
        >
          Войти
        </MenuItem>,
      ];

  return (
    <>
      <ListItemButton
        sx={rail ? railItemSx : menuItemSx}
        selected={isOpen}
        aria-haspopup='menu'
        aria-expanded={isOpen}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <ListItemIcon>
          {/* Без src и children MUI рисует иконку по умолчанию */}
          <Avatar
            src={user?.avatarUrl}
            alt=''
            sx={{ width: 24, height: 24, fontSize: 12 }}
          >
            {initials}
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={name} secondary={role} sx={revealSx(expanded)} />
      </ListItemButton>

      <Menu
        anchorEl={anchor}
        open={isOpen}
        onClose={close}
        marginThreshold={0}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { width: popupWidth, boxSizing: 'border-box', borderRadius: 2 },
          },
          list: { sx: { px: 1, py: 1 } },
        }}
      >
        {items}
      </Menu>
    </>
  );
}
