import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from './Header';

const AboutUs = ({ stats }) => {
  return (
    <>
      <Header />
      <section className="bg-background py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 space-y-4 text-center md:mb-16 lg:mb-24">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              Sobre nós
            </h2>
            <p className="text-muted-foreground text-xl">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero
              pariatur, illo adipisci ad placeat sequi doloremque alias aliquam
              similique ea labore laudantium laborum. Aspernatur alias veniam
              dolorum, nostrum nesciunt velit dolor quo natus optio, aliquid,
              laborum dolore illo doloribus? Veniam aspernatur nulla deleniti?
              Enim eius delectus similique ipsa. Ullam, minima!
            </p>
          </div>

          {/* Video player and stats */}
          <div className="relative mb-8 h-full w-full max-lg:space-y-6 sm:mb-16 lg:mb-24">
            <p className="text-center text-muted-foreground">
              Vídeo sobre nosso início
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-xl lg:h-[644px]">
              {/* <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/RQYZXwLBY8A?si=MvvPX6xaOdzySLfb"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe> */}
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/q8KzK0TWN1c?si=r-S63tP42sLd7W20"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>

            {/* Stats card overlapping the video section */}
            <div className="bg-background grid gap-10 rounded-md border p-8 sm:max-lg:grid-cols-2 lg:absolute lg:-bottom-25 lg:left-1/2 lg:w-3/4 lg:-translate-x-1/2 lg:grid-cols-4 lg:px-10 xl:w-max">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-2.5 text-center"
                >
                  <div className="flex size-7 items-center justify-center [&>svg]:size-7">
                    <stat.icon />
                  </div>
                  <span className="text-2xl font-semibold">{stat.value}</span>
                  <p className="text-muted-foreground text-lg">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
