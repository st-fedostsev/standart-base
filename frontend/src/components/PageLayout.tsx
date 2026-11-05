// src/components/PageLayout.tsx
import type { ReactNode } from 'react';

import { Box, Stack, Typography } from '@mui/material';

type PageLayoutProps = {
  /**
   * Заголовок страницы. Выводится как h1, поэтому передавать текст, а не
   * компонент.
   */
  title: string;
  /** Второй заголовок под основным, например счётчик или пояснение. */
  subtitle?: ReactNode;
  /** Кнопки действий справа от заголовка. */
  actions?: ReactNode;
  /** Фильтры и поиск между шапкой и содержимым. */
  filters?: ReactNode;
  children: ReactNode;
};

export function PageLayout({
  title,
  subtitle,
  actions,
  filters,
  children,
}: PageLayoutProps) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant='h4' component='h1' sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant='body2'
              sx={{ color: 'text.secondary', mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack
            direction='row'
            spacing={1}
            sx={{ flexShrink: 0, flexWrap: 'wrap' }}
          >
            {actions}
          </Stack>
        )}
      </Box>

      {filters && <Box>{filters}</Box>}

      <Box>{children}</Box>
    </Stack>
  );
}
