import Gallery from '@/components/gallery-component';

const gallerySections = [
  {
    images: [
      {
        src: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/gallery/image-10.png',
        alt: 'Coastal cliffs and ocean view',
      },
    ],
  },
  {
    type: 'grid',
    images: [
      {
        src: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/gallery/image-9.png',
        alt: 'Silhouettes on beach',
      },
      {
        src: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/gallery/image-8.png',
        alt: 'Snowy mountain peaks',
      },
      {
        src: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/gallery/image-7.png',
        alt: 'Rolling green hills',
      },
      {
        src: 'https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/gallery/image-6.png',
        alt: 'Sunset landscape',
      },
    ],
  },
];

const CampaignDetailsProblem = () => {
  return <Gallery sections={gallerySections} />;
};

export default CampaignDetailsProblem;
