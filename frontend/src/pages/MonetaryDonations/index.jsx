import Footer from '../../components/Footer';
import Header from '../../components/Header';
// import MonetaryDonationsList from '../../components/MonetaryDonations/MonetaryDonationsList';
import MonetaryDonations from '@/components/MonetaryDonations';

const MonetaryDonationsPage = () => {
  return (
    <>
      <Header />
      <MonetaryDonations />
      <Footer />
    </>
  );
};

export default MonetaryDonationsPage;
