import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'; // Shell com Sidebar
import DashboardOverview from './features/Dashboard/DashboardOverview';
import CampaignManagement from './features/Campaigns/CampaignManagement';
import DonationManagement from './features/Donations/DonationManagement';
import DistributionManagement from './features/Distributions/DistributionManagement';
import UserManagement from './features/Users/UserManagement';
import DonorManagement from './features/Donors/DonorManagement';

function AppRoutes() {
  return (
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

          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="donations" element={<DonationManagement />} />
          <Route path="distributions" element={<DistributionManagement />} />
          <Route path="donors" element={<DonorManagement />} />

          {/* users: rota de gestão (Protegida) */}
          <Route element={<PrivateRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Route>
      </Route>

      {/* rota para 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRoutes;
