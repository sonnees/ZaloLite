import LoginForm from "../pages/login/LoginForm";
import Main from "../pages/Home/MainHome";
import Contact from "../pages/Contact";
import Todo from "../pages/Todo";
import Message from "../pages/Message";
import OtherMessage from "../pages/Message/OtherMessage";
import Sidebar from "../layouts/dashboard/Sidebar";

import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";
// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import MessageFilterBar from "../pages/Message/MessageFilterBar";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [{ path: "login", element: <LoginForm /> }],
    },
    {
      path: "/",
      element: <DashboardLayout></DashboardLayout>,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        {
          path: "/app",
          element: <MessageFilterBar />,
          children: [
            { path: "", element: <Message /> },
            { path: "other-message", element: <OtherMessage /> },
          ],
        },
        { path: "contact", element: <Contact /> },
        { path: "todo", element: <Todo /> },
      ],
    },

    // { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

// const GeneralApp = Loadable(
//   lazy(() => import("../pages/dashboard/GeneralApp"))
// );
// const Conversation = Loadable(
//   lazy(() => import("../pages/dashboard/Conversation"))
// );
// const Chats = Loadable(lazy(() => import("../pages/dashboard/Chats")));
// const Group = Loadable(lazy(() => import("../pages/dashboard/Group")));
// const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));
// const Contact = Loadable(lazy(() => import("../sections/dashboard/Contact")));
// const Page404 = Loadable(lazy(() => import("../pages/Page404")));

// const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
// const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));
// const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
// const ResetPasswordPage = Loadable(
//   lazy(() => import("../pages/auth/ResetPassword"))
// );
// const NewPasswordPage = Loadable(
//   lazy(() => import("../pages/auth/NewPassword"))
// );

// // Settings
// const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
// const Profile = Loadable(
//   lazy(() => import("../pages/dashboard/Settings/Profile"))
// );