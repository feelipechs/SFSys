import { Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import OTPPage from './pages/OtpPage';
import ErrorPage from './pages/ErrorPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout'; // Shell com Sidebar
import DashboardOverview from './features/Dashboard/DashboardOverview';
import BeneficiaryManagement from './features/Beneficiaries/BeneficiaryManagement';
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
      <Route path="/otp" element={<OTPPage />} />

      {/* rotas protegidas*/}

      {/* PrivateRoute é o elemento que checa o login */}
      <Route element={<PrivateRoute />}>
        {/* DashboardLayout é a rota PAI que se aninha ao PrivateRoute */}
        <Route path="/" element={<DashboardLayout />}>
          {/* index: rota home (Protegida) */}
          <Route index element={<DashboardOverview />} />

          <Route path="beneficiaries" element={<BeneficiaryManagement />} />
          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="donations" element={<DonationManagement />} />
          <Route path="distributions" element={<DistributionManagement />} />
          <Route path="donors" element={<DonorManagement />} />

          {/* users: rota de gestão (Protegida) */}
          <Route element={<PrivateRoute allowedRoles={['admin', 'manager']} />}>
            <Route path="users" element={<UserManagement />} />
          </Route>

          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* rota para 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRoutes;
