import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MonetaryDonations from './pages/MonetaryDonations';
import Courses from './pages/Courses';
import Campaigns from './pages/Campaigns';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Management from './pages/Management';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/campanhas" element={<Campaigns />} />
        <Route path="/doacoes-monetarias" element={<MonetaryDonations />} />
        <Route path="/ajuda" element={<Help />} />
        <Route path="/configuracoes/perfil" element={<Profile />} />
        <Route path="/admin/gerenciamento" element={<Management />} />
      </Routes>
    </Router>
  );
}

export default App;
