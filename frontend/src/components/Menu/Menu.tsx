import { useState, type ReactNode } from 'react';

import { UserMenu } from './UserMenu';
import { menuDividerSx, menuItemSx, railItemSx, revealSx } from './menuItemSx';
import { NavLink, useLocation } from 'react-router-dom';

import { useCurrentRole } from '@/utils/hooks/useCurrentRole';
import { isExternalItem, type NavItem } from '@/utils/types/navigation';
import { hasAccess } from '@/utils/types/roles';

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type MenuProps = {
  items: NavItem[];
  /** Пункты внизу меню, над пользователем. */
  footerItems?: NavItem[];
  title?: string;
  children: ReactNode;
};

const RAIL_WIDTH = 64;
const FULL_WIDTH = 220;

const drawerPaperSx = {
  width: FULL_WIDTH,
  boxSizing: 'border-box',
  bgcolor: 'grey.100',
  borderRight: 0,
} as const;

export function Menu({ items, footerItems = [], title, children }: MenuProps) {
  const role = useCurrentRole();
  const theme = useTheme();
  // Три состояния: до md — бургер, с md до lg — полоса иконок, от lg — полное меню
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const isRail = useMediaQuery(theme.breakpoints.between('md', 'lg'), {
    noSsr: true,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { pathname } = useLocation();

  const visible = items.filter((item) => hasAccess(role, item.roles));
  const visibleFooter = footerItems.filter((item) =>
    hasAccess(role, item.roles)
  );

  // В полном меню подписи видны всегда. В полосе иконок — при наведении или фокусе с клавиатуры
  const expanded = !isRail || hovered || focused;

  // rail: стиль полосы иконок. showLabels: видны ли подписи
  const renderSidebar = (rail: boolean, showLabels: boolean) => {
    const itemSx = rail ? railItemSx : menuItemSx;

    const renderItem = (item: NavItem) => {
      const Icon = item.icon;
      const content = (
        <>
          <ListItemIcon>
            <Icon sx={{ color: 'black', fontSize: 24 }} />
          </ListItemIcon>
          <ListItemText primary={item.label} sx={revealSx(showLabels)} />
        </>
      );

      if (isExternalItem(item)) {
        return (
          <ListItemButton
            key={item.id}
            component='a'
            href={item.href}
            target='_blank'
            rel='noopener noreferrer'
            sx={itemSx}
            onClick={() => setDrawerOpen(false)}
          >
            {content}
          </ListItemButton>
        );
      }

      return (
        <ListItemButton
          key={item.id}
          component={NavLink}
          to={item.to}
          selected={pathname === item.to}
          sx={itemSx}
          onClick={() => setDrawerOpen(false)}
        >
          {content}
        </ListItemButton>
      );
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {title && (
          <>
            <Typography
              variant='h6'
              noWrap
              sx={{ px: 3, py: 2, ...revealSx(showLabels) }}
            >
              {title}
            </Typography>
            <Divider sx={menuDividerSx} variant='middle' />
          </>
        )}

        <List sx={{ px: 1, py: 1 }}>{visible.map(renderItem)}</List>

        {/* mt: auto прижимает блок к низу панели */}
        <List sx={{ px: 1, py: 1, mt: 'auto' }}>
          {visibleFooter.map(renderItem)}
          <UserMenu
            rail={rail}
            expanded={showLabels}
            popupWidth={FULL_WIDTH - 2 * 8}
          />
        </List>
      </Box>
    );
  };

  // Панель фиксирована у края. Ширина меняется только при раскрытии полосы
  const sidebarSx = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    width: expanded ? FULL_WIDTH : RAIL_WIDTH,
    boxSizing: 'border-box',
    overflowX: 'hidden',
    bgcolor: 'grey.100',
    zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create('width', { duration: 200 }),
  } as const;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile ? (
        <>
          <IconButton
            aria-label='Открыть меню'
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: 'fixed',
              top: 12,
              left: 12,
              zIndex: theme.zIndex.drawer - 1,
            }}
          >
            ☰
          </IconButton>
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
          >
            {renderSidebar(false, true)}
          </Drawer>
        </>
      ) : (
        <>
          {/* Место под панель фиксированной ширины: при наведении контент не сдвигается */}
          <Box
            sx={{ width: isRail ? RAIL_WIDTH : FULL_WIDTH, flexShrink: 0 }}
          />
          <Box
            component='nav'
            aria-label='Основное меню'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={(e) => {
              if (e.target.matches(':focus-visible')) setFocused(true);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
            }}
            sx={sidebarSx}
          >
            {renderSidebar(isRail, expanded)}
          </Box>
        </>
      )}

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          minWidth: 0,
          px: { xs: 2, md: 4 }, // 16px на телефоне, 32px от md
          pt: isMobile ? 8 : 4, // 32px сверху, на телефоне 64px под кнопку ☰
          pb: 2, // 16px снизу
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
