// src/main.tsx
import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';

import { App } from './App/App';

const container = document.getElementById('root');
if (!container) throw new Error('В index.html нет элемента #root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
