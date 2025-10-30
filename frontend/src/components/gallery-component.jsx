import { cn } from '@/lib/utils';

const Gallery = ({ sections }) => {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 text-center sm:mb-16 lg:mb-24">
          <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            Por que{' '}
            <span className="relative z-1">
              acontece?
              <span
                className="bg-primary absolute bottom-1 left-0 -z-1 h-px w-full"
                aria-hidden="true"
              ></span>
            </span>
          </h2>
          <p className="text-muted-foreground text-xl">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum,
            eum.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={cn({
                'grid grid-cols-2 gap-6': section.type === 'grid',
              })}
            >
              {section.images.map((image, imageIndex) => (
                <img
                  key={imageIndex}
                  src={image.src}
                  alt={image.alt}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
