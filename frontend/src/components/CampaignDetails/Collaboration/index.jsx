import AppIntegration from '@/components/app-integration';

const integrations = [
  {
    name: 'Microsoft',
    description: 'Empowering Innovation and Connectivity',
    image:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/microsoft-icon.png',
    alt: 'Microsoft',
  },
  {
    name: 'Spotify',
    description: 'Your soundtrack to every moment.',
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/spotify-icon.png',
    alt: 'Spotify',
  },
  {
    name: 'Github',
    description: 'Your Hub for Open Source Innovation',
    image: 'https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-white.png',
    alt: 'Github',
  },
];

const CampaignDetailsCollaboration = () => {
  return <AppIntegration integrations={integrations} />;
};

export default CampaignDetailsCollaboration;
