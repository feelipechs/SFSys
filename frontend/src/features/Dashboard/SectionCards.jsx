import * as React from 'react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GoPackageDependents } from 'react-icons/go';
import { MdFamilyRestroom } from 'react-icons/md';
import { FaHandHoldingHeart, FaUser } from 'react-icons/fa';

import { useGlobalStatsQuery } from '@/hooks/queries/useGlobalStatsQuery';
import { LoadingFail } from '@/components/LoadingContent';

// mapeamento das chaves da API para a estrutura de cartões
const mapStatsToCards = (stats) => [
  {
    title: 'Total de Doações',
    value: stats.totalDonations
      ? stats.totalDonations.toLocaleString('pt-BR')
      : '0',
    description: 'Registros de doações recebidas de todos os tempos.',
    icon: FaHandHoldingHeart,
    className: 'border-primary/20',
  },
  {
    title: 'Total de Distribuições',
    value: stats.totalDistributions
      ? stats.totalDistributions.toLocaleString('pt-BR')
      : '0',
    description: 'Entregas e ações de distribuição realizadas.',
    icon: GoPackageDependents,
    className: 'border-secondary/20',
  },
  {
    title: 'Famílias Ajudadas',
    value: stats.totalFamiliesAttended
      ? stats.totalFamiliesAttended.toLocaleString('pt-BR')
      : '0',
    description: 'Número total de beneficiários únicos (ID único).',
    icon: MdFamilyRestroom,
    className: 'border-green-500/20',
  },
  {
    title: 'Voluntários Ativos',
    value: stats.totalUsers ? stats.totalUsers.toLocaleString('pt-BR') : '0',
    description: 'Usuários cadastrados no sistema (colaboradores/voluntários).',
    icon: FaUser,
    className: 'border-indigo-500/20',
  },
];

function SectionCards() {
  const { data: stats, isLoading, isError } = useGlobalStatsQuery();

  // o fallback só ocorre para evitar erros de renderização se `data` for null/undefined, mas o mapeamento principal usa `stats` (que é o `data` da API)
  const mappedCards = stats ? mapStatsToCards(stats) : mapStatsToCards({});

  // renderiza Skeletons enquanto estiver carregando
  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className={`@container/card flex flex-col justify-between border-b-4 h-[150px]`}
          >
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-10 w-3/4" />
            </CardHeader>
            <CardFooter className="pt-2">
              <Skeleton className="h-4 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // renderiza mensagem de erro
  if (isError || !stats) {
    return <LoadingFail>estatísticas</LoadingFail>;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {mappedCards.map((card, index) => {
        const CurrentIcon = card.icon;

        return (
          <Card
            key={index}
            className={`@container/card flex flex-col justify-between border-b-4 ${card.className}`}
          >
            {/* cabeçalho: icone, título e valor */}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CurrentIcon className="size-5 text-primary/80" />
                <CardDescription className="font-medium">
                  {card.title}
                </CardDescription>
              </div>

              <CardTitle className="text-4xl font-extrabold tabular-nums text-primary/80 pt-2">
                {card.value}
              </CardTitle>
            </CardHeader>

            {/* footer: descrição */}
            <CardFooter className="pt-2">
              <div className="text-sm text-muted-foreground">
                {card.description}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default SectionCards;
