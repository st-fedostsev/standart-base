import { useState } from 'react';

import { useCurrentRole } from '@/utils/hooks/useCurrentRole';
import { type ActionItem } from '@/utils/types/actions';
import { hasAccess } from '@/utils/types/roles';

import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import Close from '@mui/icons-material/Close';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

export type MassAction = ActionItem;

type MassActionsPanelProps = {
  /** Сколько строк выбрано. При 0 панель не выводится. */
  count: number;
  onClear: () => void;
  /** Если задано, слева выводится кнопка «Выбрать всех» */
  onSelectAll?: () => void;
  /** Кнопки на панели. */
  actions?: MassAction[];
  /** Пункты меню «Ещё» */
  moreActions?: MassAction[];
  dataTid?: string;
};

const BAR_HOVER = 'rgba(255, 255, 255, 0.08)';
const DANGER_TEXT = '#FF8A80';

const barButtonSx = {
  whiteSpace: 'nowrap',
  '&:hover': { bgcolor: BAR_HOVER },
  '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.38)' },
} as const;

export function MassActionsPanel({
  count,
  onClear,
  onSelectAll,
  actions = [],
  moreActions = [],
  dataTid = 'bulk-actions',
}: MassActionsPanelProps) {
  const role = useCurrentRole();
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  if (count === 0) return null;

  const visible = (list: MassAction[]) =>
    list.filter((a) => hasAccess(role, a.roles));
  const visibleActions = visible(actions);
  const visibleMore = visible(moreActions);

  return (
    <Box
      data-tid={dataTid}
      role='region'
      aria-label='Действия над выбранными строками'
      sx={{
        position: 'fixed',
        bottom: 16,
        // Левый край совпадает с боковым меню: 64px в полосе иконок, 220px в полном меню
        left: { xs: 0, md: 64, lg: 220 },
        right: 0,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none', // пустые зоны вокруг панели не перехватывают клики
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Box
        sx={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.5,
          maxWidth: '100%',
          px: 1,
          py: 0.5,
          borderRadius: 2,
          bgcolor: '#1F1F1F',
          color: '#FFFFFF',
          boxShadow: (theme) => theme.shadows[8],
        }}
      >
        {onSelectAll && (
          <Button
            color='inherit'
            onClick={onSelectAll}
            startIcon={<CheckBoxOutlined fontSize='small' />}
            sx={barButtonSx}
          >
            Выбрать всех
          </Button>
        )}

        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              color='inherit'
              disabled={action.disabled}
              onClick={action.onClick}
              startIcon={Icon ? <Icon fontSize='small' /> : undefined}
              sx={{
                ...barButtonSx,
                color: action.danger ? DANGER_TEXT : undefined,
              }}
            >
              {action.label}
            </Button>
          );
        })}

        {visibleMore.length > 0 && (
          <>
            <Button
              color='inherit'
              aria-haspopup='menu'
              aria-expanded={Boolean(moreAnchor)}
              startIcon={<MoreHoriz fontSize='small' />}
              onClick={(e) => setMoreAnchor(e.currentTarget)}
              sx={barButtonSx}
            >
              Ещё
            </Button>
            <Menu
              anchorEl={moreAnchor}
              open={Boolean(moreAnchor)}
              onClose={() => setMoreAnchor(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              {visibleMore.map((action) => {
                const Icon = action.icon;
                const color = action.danger ? 'error.main' : undefined;
                return (
                  <MenuItem
                    key={action.id}
                    disabled={action.disabled}
                    onClick={() => {
                      setMoreAnchor(null);
                      action.onClick();
                    }}
                    sx={{ color }}
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
          </>
        )}

        <Divider
          orientation='vertical'
          flexItem
          sx={{ borderColor: 'rgba(255, 255, 255, 0.16)', mx: 1 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            variant='body2'
            aria-live='polite'
            sx={{ whiteSpace: 'nowrap', px: 1 }}
          >
            Выбрано: {count}
          </Typography>
          <IconButton
            size='small'
            color='inherit'
            aria-label='Снять выбор'
            onClick={onClear}
            sx={{ '&:hover': { bgcolor: BAR_HOVER } }}
          >
            <Close fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
