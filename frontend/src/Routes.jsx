import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'; // Shell com Sidebar
import DashboardOverview from './features/Dashboard/DashboardOverview';
import UserManagement from './features/Users/Users/UserManagement';
import ErrorPage from './pages/ErrorPage';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* rotas protegidas*/}

        {/* PrivateRoute é o elemento que checa o login */}
        <Route element={<PrivateRoute />}>
          {/* DashboardLayout é a rota PAI que se aninha ao PrivateRoute */}
          <Route path="/" element={<DashboardLayout />}>
            {/* index: rota home (Protegida) */}
            <Route index element={<DashboardOverview />} />

            {/* users: rota de gestão (Protegida) */}
            <Route
              element={<PrivateRoute allowedRoles={['admin', 'manager']} />}
            >
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>

        {/* rota para 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
