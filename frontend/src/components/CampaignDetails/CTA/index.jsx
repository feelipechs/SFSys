import { Card, CardContent } from '@/components/ui/card';

const CampaignDetailsCTA = () => {
  return (
    <section className="bg-background py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border-none py-8 shadow-lg sm:py-16 lg:py-24">
          <CardContent className="flex flex-wrap items-center justify-between gap-8 px-8 sm:flex-nowrap sm:px-16 lg:px-24">
            <div className="max-w-xs lg:max-w-lg">
              <h2 className="mb-4 text-3xl font-bold">Faça a diferença</h2>
              <p className="text-muted-foreground text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                dolorum iste reiciendis dolores esse facere.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 max-md:w-full max-md:flex-col md:justify-end">
              <div className="bg-card-foreground flex w-[200px] items-center gap-4 rounded-md px-6 py-3">
                <img
                  src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/apple-icon.png"
                  alt="App Store"
                  className="size-8.5 invert dark:invert-0"
                />
                <div className="flex flex-col items-start">
                  <p className="text-card text-xs leading-4">Doe produtos</p>
                  <p className="text-card text-base leading-6 font-medium opacity-90">
                    Produtos
                  </p>
                </div>
              </div>

              <div className="bg-card-foreground flex w-[200px] items-center gap-4 rounded-md px-6 py-3">
                <img
                  src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/google-play-icon.png"
                  alt="Google Play"
                  className="size-8.5"
                />
                <div className="flex flex-col items-start">
                  <p className="text-card text-xs leading-4">Doe em dinheiro</p>
                  <p className="text-card text-base leading-6 font-medium opacity-90">
                    Dinheiro
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CampaignDetailsCTA;
