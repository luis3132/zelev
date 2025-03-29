"use client";

import AboutUs from "@/components/main/aboutUs";
import ImageSlider from "@/components/main/imageSlider";
import Tecnologies from "@/components/main/tecnologies";
import NavbarLogOut from "@/components/navbar/NavbarLogOut";

export default function Home() {
  const slides = [
    {
      id: 1,
      src: '/bolsos/bolsos.webp', // Asegúrate de tener estas imágenes en tu carpeta public/images
      alt: 'Descripción de la primera imagen',
      caption: 'Título de la imagen 1'
    },
    {
      id: 2,
      src: '/bolsos/bolso1.jpeg',
      alt: 'Descripción de la segunda imagen',
      caption: 'Título de la imagen 2'
    },
    {
      id: 3,
      src: '/bolsos/bolso2.jpeg',
      alt: 'Descripción de la tercera imagen',
      caption: 'Título de la imagen 3'
    },
    {
      id: 4,
      src: '/bolsos/bolso3.jpg',
      alt: 'Descripción de la tercera imagen',
      caption: 'Título de la imagen 4'
    },
  ];
  return (
    <>
      <main className="w-full md:pt-20">
        <NavbarLogOut />
        <h1 className="md:hidden font-Quintessential text-5xl text-center pt-6">ZELÉV</h1>
        <h2 className="font-Quintessential text-center text-white/50 text-2xl p-4">El privilegio de lo exclusivo, ahora en tus manos.</h2>
        <aside className="w-full flex justify-center px-2 pt-4">
          <div className="w-[90%] md:w-[80%] max-h-[512px] flex max-md:flex-col gap-4 md:gap-8">
            <div className="w-full md:w-3/4">
              <ImageSlider slides={slides} />
            </div>
            <div className="w-full md:max-w-[230px] md:w-1/4 flex md:flex-col max-h-inherit items-center">
              <div className="w-full overflow-hidden md:h-[50%]">
                <AboutUs />
              </div>
              <div className="w-full md:max-w-[230px] overflow-hidden md:h-[50%]">
                aqui va otra vaina
              </div>
            </div>
          </div>
          
        </aside>
      </main>
      <section className="pt-4">
        <h4 className="font-Quintessential text-center text-white/50 text-2xl py-4">Tecnologías utilizadas</h4>
        <Tecnologies />
      </section>
    </>
  );
}
