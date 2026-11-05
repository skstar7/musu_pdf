import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ToolPage } from "../pages/tools/ToolPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/tools/:slug",
    element: <ToolPage />
  }
]);
