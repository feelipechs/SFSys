import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const tabs = [
  {
    name: 'PIX',
    value: 'pix',
    description:
      'Doação instantânea, segura e sem taxas. Use o QR Code ou a chave PIX.',
    pixKey: '123.456.789-00',
    pixKeyType: 'CPF/CNPJ',
    recipientName: 'Nome da Entidade/Pessoa',
    qrCodeUrl: '/caminho/para/qrcode-pix.png', // url de imagem (se estático) ou gerado dinamicamente
  },
  {
    name: 'Boleto',
    value: 'boleto',
    description:
      'Gere um boleto bancário para doações. O prazo de compensação é de 1 a 3 dias úteis.',
    requiresAction: true, // parâmetro para indicar que precisa de uma ação (button/dialog)
  },
  {
    name: 'Crypto',
    value: 'crypto',
    description:
      'Aceitamos as principais criptomoedas (BTC, ETH, etc.). Atenção à rede de transferência!',
    wallets: [
      // lista de carteiras
      {
        currency: 'Bitcoin (BTC)',
        address: 'bc1qlw244fcz9a7z4s0d8k5t3q9e4d0x2n...',
        network: 'Bitcoin',
        qrCodeUrl: '/caminho/para/qrcode-btc.png',
      },
      {
        currency: 'Ethereum (ETH)',
        address: '0x1234567890abcdef1234567890abcdef...',
        network: 'ERC-20',
        qrCodeUrl: '/caminho/para/qrcode-eth.png',
      },
    ],
  },
];

// atualmente estático, será necessário conectar a alguma api de pagamentos...
const MonetaryDonations = () => {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">
        Deseja doar em dinheiro?
      </h1>
      <p className="text-center mb-10 text-gray-600 dark:text-gray-400">
        Você pode doar dinheiro em espécie, PIX ou até mesmo criptomoedas! Aqui
        a doação vai para a ONG decidir onde investir, para doar a uma campanha
        específica, acesse "Campanhas"
      </p>

      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue={tabs[0].value} className="w-full">
              <TabsList className="bg-background w-full justify-start rounded-none border-b p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="bg-background data-[state=active]:border-b-primary h-full rounded-none border-b-2 border-transparent data-[state=active]:shadow-none flex-1"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="p-4">
                  {/* Descrição em todas as abas */}
                  <p className="text-muted-foreground mb-6 text-sm">
                    {tab.description}
                  </p>

                  {/* pix*/}
                  {tab.value === 'pix' && (
                    <div className="space-y-4">
                      {/* qrcode aqui */}
                      <div className="flex justify-center">
                        {/* substituir */}
                        <div className="h-40 w-40 bg-gray-200 flex items-center justify-center rounded-lg">
                          QR CODE PIX
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Chave PIX ({tab.pixKeyType}):
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {tab.pixKey}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Destinatário: **{tab.recipientName}**
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Copiar Chave
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* boleto */}
                  {tab.value === 'boleto' && tab.requiresAction && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          Gerar Boleto de Doação
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Valor do Boleto</DialogTitle>
                          <DialogDescription>
                            Digite o valor que deseja doar. O boleto será
                            compensado em até 3 dias úteis.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="donationValue"
                              className="text-right"
                            >
                              Valor
                            </Label>
                            <Input
                              id="donationValue"
                              defaultValue="50,00"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button>Confirmar e Gerar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* crypto */}
                  {tab.value === 'crypto' && (
                    <div className="space-y-6">
                      <p className="text-red-500 font-semibold text-sm">
                        ⚠️ Aviso: Confirme sempre a moeda e a rede antes de
                        enviar.
                      </p>

                      {tab.wallets.map((wallet) => (
                        <div
                          key={wallet.currency}
                          className="border p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                          <h4 className="font-bold mb-2">{wallet.currency}</h4>
                          <p className="text-xs text-muted-foreground mb-1">
                            Rede: {wallet.network}
                          </p>

                          <div className="flex items-center space-x-2">
                            <Input
                              readOnly
                              value={wallet.address}
                              className="text-xs truncate"
                            />
                            <Button size="sm" variant="secondary">
                              Copiar
                            </Button>
                          </div>

                          {/* opcional: adicionar qr-code aqui se necessário */}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonetaryDonations;
