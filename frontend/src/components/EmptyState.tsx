import type { ElementType, ReactNode } from 'react';

import InboxOutlined from '@mui/icons-material/InboxOutlined';
import { Box, Typography } from '@mui/material';

type EmptyStateProps = {
  /** Иконка сверху, компонент, например PersonAddAltOutlined. */
  icon?: ElementType;
  /** Заголовок, необязательный. */
  title?: string;
  /** Пояснение под заголовком. */
  description?: ReactNode;
  /** Кнопка действия. Ограниченные ролью оборачивайте в PermissionGuard. */
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon = InboxOutlined,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        py: 8,
        px: 2,
      }}
    >
      <Icon sx={{ fontSize: 48, color: 'text.disabled' }} />
      {title && (
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography
          variant='body2'
          sx={{ color: 'text.secondary', maxWidth: 360 }}
        >
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}
