import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

const AppIntegration = ({ integrations }) => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
              Formas de Colaboração
            </h2>
            <p className="text-muted-foreground text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
              repellendus, corrupti ipsa aut officiis enim.
            </p>
          </div>

          <div className="space-y-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="bg-transparent py-4 shadow-none">
                <CardContent className="flex items-center gap-6">
                  <div className="flex size-17 shrink-0 items-center justify-center rounded-md border">
                    <img
                      src={integration.image}
                      alt={integration.alt}
                      className="size-10"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-medium">
                      {integration.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {integration.description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppIntegration;
