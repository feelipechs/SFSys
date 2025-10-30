import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import MonetaryDonationsPage from './pages/MonetaryDonations';
import CampaignsPage from './pages/Campaigns';
import FAQPage from './pages/Faq';
import ProfilePage from './pages/Profile';
import ManagementPage from './pages/Management';
import AdminPage from './pages/Admin';
import ContactUsPage from './pages/Contact';
import CampaignDetails from './pages/CampaignDetails';
import AboutUsPage from './pages/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastrar" element={<RegisterPage />} />
        <Route path="/campanhas" element={<CampaignsPage />} />
        <Route path="/campanhas/id-campanha" element={<CampaignDetails />} />
        <Route path="/doacoes-monetarias" element={<MonetaryDonationsPage />} />
        <Route path="/ajuda" element={<FAQPage />} />
        <Route path="/configuracoes/perfil" element={<ProfilePage />} />
        <Route path="/admin/gerenciamento" element={<ManagementPage />} />
        <Route path="/contato" element={<ContactUsPage />} />
        <Route path="/sobre" element={<AboutUsPage />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
