import type { KeyboardEvent } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dataTid?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = 'Поиск',
  dataTid = 'search-input',
}: SearchInputProps) {
  const clear = () => onChange('');

  // Escape очищает поле, как в строках поиска браузеров
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && value !== '') {
      e.preventDefault();
      clear();
    }
  };

  return (
    <TextField
      data-tid={dataTid}
      size='small'
      fullWidth
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      slotProps={{
        htmlInput: { 'aria-label': placeholder },
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon fontSize='small' sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment:
            value !== '' ? (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  edge='end'
                  aria-label='Очистить поиск'
                  onClick={clear}
                >
                  <ClearIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            ) : undefined,
        },
      }}
    />
  );
}
