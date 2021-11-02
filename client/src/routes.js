import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "src/layouts/DashboardLayout";
import MainLayout from "src/layouts/MainLayout";
import AccountView from "src/views/account/AccountView";

import SurveyView from "./views/survey";
import UserView from "./views/user";
import DashboardView from "src/views/reports/DashboardView";
import LoginView from "src/views/auth/LoginView";
import NotFoundView from "src/views/errors/NotFoundView";
import RegisterView from "src/views/auth/RegisterView";

import AddSurvey from "./views/survey/AddSurvey";

import EditSurvey from "./views/survey/EditSurvey";

import TakeSurvey from "./views/survey/TakeSurvey";

const routes = (autenticated) => {
  return autenticated
    ? [
        {
          path: "app",
          element: <DashboardLayout />,
          children: [
            { path: "account", element: <AccountView /> },

            // { path: 'users/all', element: <UserView /> },
            // { path: 'users/addUser', element: <AddUser /> },
            // { path: 'users/editUser/:id', element: <EditUser /> },

            { path: "surveys", element: <SurveyView /> },
            { path: "surveys/addSurvey", element: <AddSurvey /> },
            { path: "surveys/editSurvey/:id", element: <EditSurvey /> },
            { path: "surveys/takeSurvey/:id", element: <TakeSurvey /> },

            { path: "dashboard", element: <DashboardView /> },

            { path: "*", element: <Navigate to="/404" /> },
          ],
        },
        {
          path: "/",
          element: <MainLayout />,
          children: [
            { path: "login", element: <Navigate to="/app/dashboard" /> },
            { path: "register", element: <Navigate to="/app/dashboard" /> },
            { path: "404", element: <NotFoundView /> },
            { path: "/", element: <Navigate to="/app/dashboard" /> },
            { path: "*", element: <Navigate to="/404" /> },
          ],
        },
      ]
    : [
        {
          path: "app",
          element: <DashboardLayout />,
          children: [{ path: "*", element: <Navigate to="/login" /> }],
        },
        {
          path: "/",
          element: <MainLayout />,
          children: [
            { path: "login", element: <LoginView /> },
            { path: "register", element: <RegisterView /> },
            { path: "404", element: <NotFoundView /> },
            { path: "/", element: <Navigate to="/login" /> },
            { path: "*", element: <Navigate to="/404" /> },
          ],
        },
      ];
};

export default routes;
