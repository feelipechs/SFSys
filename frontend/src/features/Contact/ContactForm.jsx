import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// reutiliza a estrutura visual básica do FormItem para espaçamento
const FormItem = ({ children }) => <div className="space-y-2">{children}</div>;
const FormLabel = ({ htmlFor, children }) => (
  <Label htmlFor={htmlFor}>{children}</Label>
);

const ContactForm = () => {
  // usa um estado para gerenciar o loading (isPending)
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // inicia o loading

    const formData = new FormData(event.target);
    formData.append('access_key', '0e504a1c-5bc3-4d90-9f01-8eaff55f604c');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('E-mail enviado com sucesso!', { duration: 3000 });
        event.target.reset();
      } else {
        console.error('Erro no Web3Forms:', data);
        toast.error('Erro ao enviar e-mail. Tente novamente mais tarde.', {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro de rede. Verifique sua conexão.', {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false); // finaliza o loading
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Envie uma mensagem</CardTitle>
        <CardDescription>
          Tem uma sugestão ou precisa de suporte? Envie-nos uma mensagem e
          responderemos em breve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* email */}
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            {/* 'name' para FormData */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              disabled={isSubmitting}
              required
            />
          </FormItem>

          {/* nome */}
          <FormItem>
            <FormLabel htmlFor="name">Nome</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nome"
              disabled={isSubmitting}
              required
            />
          </FormItem>

          {/* mensagem */}
          <FormItem>
            <FormLabel htmlFor="message">Mensagem</FormLabel>
            <Textarea
              id="message"
              name="message" // 'name' para FormData
              placeholder="Digite seu texto..."
              disabled={isSubmitting}
              required
            />
          </FormItem>

          {/* botão */}
          <FormItem className="pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </FormItem>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
