import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ContactUs = ({ contactInfo }) => {
  return (
    <section className="bg-background py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mx-auto mb-12 w-fit sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Contate-nos
          </h2>
          <span className="bg-primary absolute top-9 left-0 h-px w-full"></span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src="/images/contato.jpg"
            alt="Ilustração de Contato"
            className="size-full rounded-md object-cover max-lg:max-h-70"
          />

          <div>
            <h3 className="mb-6 text-2xl font-semibold">
              Ficamos felizes em ajudá-lo!
            </h3>
            <p className="text-muted-foreground mb-10 text-lg font-medium">
              Abaixo estão nossas formas de contato.
            </p>

            {/* Contact Info Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {contactInfo.map((info, index) => (
                <Card className="border-none shadow-none" key={index}>
                  <CardContent className="flex flex-col items-center gap-4 text-center">
                    <Avatar className="size-9 border">
                      <AvatarFallback className="bg-transparent [&>svg]:size-5">
                        <info.icon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold">{info.title}</h4>
                      <div className="text-muted-foreground text-base font-medium">
                        {info.description.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
