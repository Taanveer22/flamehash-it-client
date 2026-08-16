import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import publicRoutes from "./routes/publicRoutes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={publicRoutes}></RouterProvider>
    <ToastContainer></ToastContainer>
  </StrictMode>,
);
