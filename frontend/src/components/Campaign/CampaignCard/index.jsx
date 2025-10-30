import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CampaignCard = ({
  imageUrl,
  title,
  description,
  linkDetails,
  linkText = 'Ver Detalhes',
}) => {
  return (
    <Card className="max-w-md pt-0">
      <CardContent className="px-0">
        <img
          className="aspect-video rounded-t-xl object-cover"
          src={imageUrl}
          alt={`Imagem da campanha ${title}`}
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
        <Link
          to={linkDetails}
          className="mt-4 inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          {linkText}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CampaignCard;
