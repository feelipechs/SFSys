import Navbar from '../nav-component';

const navigationData = [
  {
    title: 'Campanhas',
    href: '/campanhas',
  },
  {
    title: 'Doações Monetárias',
    href: '/doacoes-monetarias',
  },
  {
    title: 'Ajuda',
    href: '/ajuda',
  },
  {
    title: 'Contato',
    href: '/contato',
  },
];

const Header = () => {
  return (
    <div className="h-16 border-b">
      <Navbar navigationData={navigationData} />
    </div>
  );
};

export default Header;
