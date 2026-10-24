import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { UITestsPage } from "../components/pages/UITestsPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<UITestsPage />} path="/" />
    </>,
  ),
);
