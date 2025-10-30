import { MedalIcon, SparklesIcon, StarIcon, TargetIcon } from 'lucide-react';

import AboutUs from '@/components/about-us';

const stats = [
  {
    icon: SparklesIcon,
    value: '20+',
    description: 'Anos de experiência',
  },
  {
    icon: TargetIcon,
    value: '70+',
    description: 'Projetos bem-sucedidos',
  },
  {
    icon: StarIcon,
    value: '550+',
    description: 'Avaliações',
  },
  {
    icon: MedalIcon,
    value: '25',
    description: 'Prêmios conquistados',
  },
];

const AboutUsPage = () => {
  return <AboutUs stats={stats} />;
};

export default AboutUsPage;
