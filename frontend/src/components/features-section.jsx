import React from 'react';

import { ArrowRightIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

const Features = ({ featuresList }) => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            O que fazemos para solucinar esse problema?
          </h2>
          <p className="text-muted-foreground text-xl">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga nam
            minus, ipsa veritatis sed voluptatem reprehenderit recusandae
            temporibus enim ea!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((features, index) => (
            <Card
              key={index}
              className={cn(
                'shadow-none transition-colors duration-300',
                features.cardBorderColor
              )}
            >
              <CardContent>
                <Avatar
                  className={cn(
                    'mb-6 size-10 rounded-md',
                    features.avatarTextColor
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      'rounded-md [&>svg]:size-6',
                      features.avatarBgColor
                    )}
                  >
                    <features.icon />
                  </AvatarFallback>
                </Avatar>
                <h6 className="mb-2 text-lg font-semibold">{features.title}</h6>
                <p className="text-muted-foreground">{features.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
