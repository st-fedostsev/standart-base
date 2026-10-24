import { type FC } from "react";
import { createRoot, type Root } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes";

export const App: FC = () => {
  return <RouterProvider router={router} />;
};

// Точка входа: index.html подключает этот файл.
const container = document.getElementById("root");
if (!container) throw new Error('В index.html нет <div id="root">');

// При HMR модуль выполняется снова, поэтому корень храним в import.meta.hot.data.
const root: Root = import.meta.hot?.data.root ?? createRoot(container);
if (import.meta.hot) import.meta.hot.data.root = root;

root.render(<App />);
