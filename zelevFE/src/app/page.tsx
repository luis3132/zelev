"use client";

import AboutUs from "@/components/main/aboutUs";
import Tecnologies from "@/components/main/tecnologies";
import NavbarLogOut from "@/components/navbar/NavbarLogOut";

export default function Home() {
  return (
    <>
      <main className="w-full">
        <NavbarLogOut />
        <h1 className="md:hidden font-Quintessential text-5xl text-center pt-6">ZELÉV</h1>
        <h2 className="font-Quintessential text-center text-white/50 text-2xl py-4">El privilegio de lo exclusivo, ahora en tus manos.</h2>
        <aside className="w-full flex justify-center px-2 pt-4">
          <div className="w-[90%] md:w-[70%] grid grid-cols-2 md:grid-cols-4 grid-rows-2 md:gap-8 gap-4">
            <div className="bg-white col-span-2 md:col-span-3 row-span-1 md:row-span-2 text-black rounded-2xl overflow-hidden">1</div>
            <div className="col-span-1 row-span-1 max-md:row-start-2 rounded-2xl overflow-hidden shadow-2xl shadow-white/20">
              <AboutUs />
            </div>
            <div className="bg-black col-span-1 row-span-1 col-start-2 md:col-start-4 row-start-2 text-black rounded-2xl overflow-hidden">3</div>
          </div>
        </aside>
      </main>
      <section className="pt-4">
        <h4 className="font-Quintessential text-center text-white/50 text-2xl py-4">Tecnologías utilizadas</h4>
        <Tecnologies />
      </section>
      <div className="min-h-24 md:min-h-5"></div>
    </>
  );
}
