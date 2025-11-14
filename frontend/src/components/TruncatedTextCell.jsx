import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function TruncatedTextCell({ text, headerLabel = 'Observação' }) {
  if (!text) {
    return <span>—</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          {/* botão compacto */}
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs font-semibold"
            title={`Ver ${headerLabel} completa`}
          >
            Ver
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{headerLabel}</DialogTitle>
          <DialogDescription>Lista do texto completo.</DialogDescription>
        </DialogHeader>
        {/* exibe o texto completo dentro do modal */}
        <p className="whitespace-pre-wrap text-sm">{text}</p>
      </DialogContent>
    </Dialog>
  );
}
