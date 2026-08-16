import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import Projects from "../pages/Projects";
import Dashboard from "../pages/Dashboard";

const publicRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/projects",
        Component: Projects,
      },
      {
        path: "/services",
        Component: Services,
      },
      {
        path: "/aboutUs",
        Component: AboutUs,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
    ],
  },
]);

export default publicRoutes;
