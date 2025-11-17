import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append('access_key', '0e504a1c-5bc3-4d90-9f01-8eaff55f604c');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      toast.success('E-mail enviado com sucesso!', { duration: 3000 });
      event.target.reset();
    } else {
      console.log('Error', data);
      toast.error('Erro ao enviar e-mail.', { duration: 3000 });
    }
  };

  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4 py-12">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Envie uma mensagem</CardTitle>
            <CardDescription>
              Tem uma sugestão ou precisa de suporte? Envie-nos uma mensagem e
              responderemos em breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <Input id="name" type="text" placeholder="Nome" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">Mensagem</FieldLabel>
                  <Textarea
                    id="message"
                    type="text"
                    placeholder="Digite seu texto..."
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit">Enviar</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
