import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { IconFolderCode } from '@tabler/icons-react';
import { ArrowUpRightIcon, RefreshCcwIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// primeira letra maiuscula
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function LoadingContent({ children }) {
  const entityName = String(children || 'conteúdo'); // default para 'conteúdo'

  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Carregando {entityName}...</EmptyTitle>
        <EmptyDescription>
          Aguarde enquanto processamos sua solicitação. Não atualize a página.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function LoadingFail({ children }) {
  const entityName = String(children || 'o conteúdo');
  const lowerCaseName = entityName.toLowerCase();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>Erro ao carregar conteúdo</EmptyTitle>
        <EmptyDescription>
          Erro ao carregar {lowerCaseName}. Verifique o servidor.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcwIcon />
          Atualizar
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export function NoContent({ children, createComponent }) {
  // converte a entidade para string (caso seja um elemento React)
  const entityName = String(children);

  // ex: 'Campanhas'
  const capitalizedName = capitalizeFirstLetter(entityName);

  // ex: 'campanhas'
  const lowerCaseName = entityName.toLowerCase();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{capitalizedName} não encontrados(as)</EmptyTitle>
        <EmptyDescription>
          Você ainda não cadastrou {lowerCaseName}. Comece criando seu primeiro
          registro.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {createComponent ? (
          createComponent
        ) : (
          <Button>Criar {capitalizedName}</Button>
        )}
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <Link to="/help">
          Ler Mais <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}
