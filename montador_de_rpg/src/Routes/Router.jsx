import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoginUser from "../pages/LoginUser.jsx";
import UserMenu from "../pages/UserMenu.jsx";
import PlayerPanel from "../pages/PlayerPanel.jsx";
import Jogo from "../pages/Jogo/Jogo.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import OAuth2Redirect from "../pages/OAuth2Redirect.jsx";
import { ProtectedRoute } from "./ProtecaoManeira.jsx";
import TesteResolucao from "../pages/TesteResolucao.jsx";
import Registro from "../pages/Registro.jsx";
import CriacaoPersonagem from "../pages/CriacaoPersonagem/CriacaoPersonagem.jsx";

const Router = () =>
  createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/registro",
      element: <Registro />,
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
    {
      path: "/criar-personagem",
      element: (
        <ProtectedRoute>
          <CriacaoPersonagem />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/jogo",
      element: <Jogo />,
      errorElement: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

export default Router;