import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoginUser from "../pages/LoginUser.jsx";
import UserMenu from "../pages/UserMenu.jsx";
import PlayerPanel from "../pages/PlayerPanel.jsx";
import Jogo from "../pages/Jogo/Jogo.jsx"
import ErrorPage from "../pages/ErrorPage.jsx";
import OAuth2Redirect from "../pages/OAuth2Redirect.jsx";
import { ProtectedRoute } from "./ProtecaoManeira.jsx";
/* import MasterPanel from "../pages/MasterPanel.jsx"; */
/* import LoginAdm from "../pages/LoginAdm.jsx";
import AdmMenu from "../pages/AdmMenu.jsx";
import AdmPanel from "../pages/AdmPanel.jsx"; */

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
      path: "/oauth2/redirect", 
      element: <OAuth2Redirect />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/menu",
      element: (
      <ProtectedRoute>
        <UserMenu />
      </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/player",
      element: <PlayerPanel />,
      errorElement: <ErrorPage />,
    },
    /* {
      path: "/master",
      element: <MasterPanel />,
      errorElement: <ErrorPage />,
    }, */
    /* {
      path: "/loginadm",
      element: <LoginAdm />,
      errorElement: <ErrorPage />,
    }, */
    /* {
      path: "/adm",
      element: (
        <ProtectedRoute>
          <AdmMenu />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    }, */
    /* {
      path: "/adm/painel",
      element: (
        <ProtectedRoute>
          <AdmPanel />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    }, */
    {
      path: "/jogo",
      element: (
        <Jogo />
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

export default Router;