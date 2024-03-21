import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import ClientsPage from './pages/ClientsPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/landingPage/index';
import SignUpPage from './pages/SignUpPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import AddClientPage from './pages/AddClientPage'
import ViewDocument from './pages/viewDocuments'
import PasswordReset from './pages/PasswordReset'
import TransferUser from './pages/TransferUser'
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/files" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'transfer', element: <TransferUser /> },
        { path: 'files', element: <ClientsPage /> },
        { path: 'files/new', element: <AddClientPage/> },
        { path: 'files/view', element: <ViewDocument /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'passwordReset',
      element: <PasswordReset />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
