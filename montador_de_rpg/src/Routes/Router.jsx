import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoginUser from "../pages/LoginUser.jsx";
import UserMenu from "../pages/UserMenu.jsx";
import MasterPanel from "../pages/MasterPanel.jsx";
import PlayerPanel from "../pages/PlayerPanel.jsx";
import LoginAdm from "../pages/LoginAdm.jsx";
import AdmMenu from "../pages/AdmMenu.jsx";
import AdmPanel from "../pages/AdmPanel.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import { ProtectedRoute } from "./ProtecaoManeira.jsx";

const Router = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <LoginUser />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/menu",
      element: <UserMenu />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/player",
      element: <PlayerPanel />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/master",
      element: <MasterPanel />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/loginadm",
      element: <LoginAdm />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/adm",
      element: (
        <ProtectedRoute>
          <AdmMenu />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/adm/painel",
      element: (
        <ProtectedRoute>
          <AdmPanel />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

export default Router;