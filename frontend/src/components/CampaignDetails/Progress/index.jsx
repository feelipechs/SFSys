import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

const CampaignDetailsProgress = () => {
  const [progress, setProgress] = useState();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-8 sm:py-16 lg:py-24">
      <h1 className="text-2xl text-center">Progresso</h1>
      <h1 className="text-center">
        Total Arrecadado: <strong>R$ 0</strong>
      </h1>
      <div className="flex justify-center">
        <Progress value={progress} className="w-[60%]" />
      </div>
      <h1 className="text-center">Início: dd/mm/aaaa</h1>
      <h1 className="text-center">Fim: dd/mm/aaaa</h1>
    </div>
  );
};

export default CampaignDetailsProgress;
