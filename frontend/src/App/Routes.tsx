import { CardsPage } from '../pages/CardPage/CardsPage';
import { ContentLayout } from './ContentLayout';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ContentLayout />}>
      <Route element={<CardsPage />} path='/' />
      {/* <Route
        path="/admin"
        element={
          <PermissionGuard minRole="admin" fallback={<Navigate to="/" replace />}>
            <AdminPage />
          </PermissionGuard>
        }
      /> */}
    </Route>
  )
);
