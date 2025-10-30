import CampaignDetailsHeroSection from '@/components/CampaignDetails/HeroSection';
import CampaignDetailsProgress from '@/components/CampaignDetails/Progress';
import CampaignDetailsCTA from '@/components/CampaignDetails/CTA';
import CampaignDetailsProblem from '@/components/CampaignDetails/Problem';
import CampaignDetailsSolution from '@/components/CampaignDetails/Solution';
import CampaignDetailsItems from '@/components/CampaignDetails/Items';
import CampaignDetailsCollaboration from '@/components/CampaignDetails/Collaboration';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const CampaignDetails = () => {
  return (
    <>
      <Header />
      <CampaignDetailsHeroSection />
      <CampaignDetailsProgress />
      <CampaignDetailsCTA />
      <CampaignDetailsProblem />
      <CampaignDetailsSolution />
      <CampaignDetailsItems />
      <CampaignDetailsCollaboration />
      <Footer />
    </>
  );
};

export default CampaignDetails;
