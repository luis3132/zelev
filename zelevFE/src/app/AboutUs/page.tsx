import Image from "next/image";

export default function AboutUs() {
    return (
        <main className="w-full flex items-center justify-center pt-20">
            <article className="md:max-w-[80%] max-w-[90%] text-center p-6">
                <h1 className="text-center text-4xl pb-4 font-Quintessential">Sobre nosotros</h1>
                <section className="flex flex-col md:flex-row items-center mb-8">
                    <figure className="md:w-1/3 md:mr-6 flex flex-col justify-center">
                        <Image
                            width={1000}
                            height={1000}
                            src="/aboutus/campesinoCostal.jpg"
                            alt="Historia de la empresa"
                            className="w-full rounded-lg shadow-xl shadow-white/20 object-cover" />
                        <figcaption className="text-sm text-gray-500 mt-2 text-center">Imagen representativa de nuestros orígenes en el campo.</figcaption>
                    </figure>
                    <div className="md:w-2/3 text-center md:text-start">
                        <header>
                            <h1 className="text-4xl font-bold mb-6 font-Quintessential">Nuestra Historia</h1>
                        </header>
                        <p className="text-lg mb-4">
                            Nuestra empresa tiene sus raíces en el corazón del campo, donde un grupo de campesinos apasionados y dedicados comenzó a fabricar costales resistentes y confiables para transportar cualquier tipo de mercancía. Estos costales, diseñados con esmero y precisión, pronto se destacaron por su calidad excepcional y su durabilidad incomparable.
                        </p>
                        <p className="text-lg mb-4">
                            Con el paso del tiempo, la creatividad y el ingenio de estos artesanos los llevaron a transformar esos costales en algo más que simples herramientas de transporte. Incorporaron diseños únicos, materiales de alta calidad y detalles cuidadosamente elaborados, convirtiendo sus creaciones en piezas exclusivas que combinaban funcionalidad y estilo.
                        </p>
                        <p className="text-lg mb-4">
                            Lo que comenzó como una pequeña iniciativa local pronto se convirtió en una marca de lujo reconocida a nivel mundial. Hoy en día, nuestra empresa es un testimonio del esfuerzo, la dedicación y la pasión de aquellos campesinos que soñaron con algo más grande.
                        </p>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row-reverse items-center mt-8 mb-8">
                    <figure className="md:w-1/3">
                        <Image
                            width={1000}
                            height={1000}
                            src="/aboutus/artesano.webp"
                            alt="Procesos de producción"
                            className="w-full rounded-lg shadow-xl object-cover shadow-white/20" />
                        <figcaption className="text-sm text-gray-500 mt-2">Nuestros artesanos en acción durante el proceso de producción.</figcaption>
                    </figure>
                    <div className="md:w-2/3 md:mr-6 text-center md:text-end">
                        <header>
                            <h2 className="text-3xl font-semibold mb-4 font-Quintessential">Procesos de Producción</h2>
                        </header>
                        <p className="text-lg mb-4">
                            Cada bolso que fabricamos es el resultado de un proceso artesanal meticuloso. Nuestros artesanos combinan técnicas tradicionales transmitidas de generación en generación con innovaciones modernas para crear piezas únicas que reflejan nuestra herencia y compromiso con la excelencia.
                        </p>
                        <p className="text-lg mb-4">
                            Utilizamos materiales de la más alta calidad, seleccionados cuidadosamente para garantizar la durabilidad y la elegancia de cada bolso. Desde el corte del cuero hasta el último detalle de costura, cada paso del proceso es realizado con precisión y dedicación.
                        </p>
                    </div>
                </section>
                <section className="flex flex-col md:flex-row items-center mt-8 mb-8">
                    <figure className="md:w-1/3 md:mr-6">
                        <Image
                            width={1000}
                            height={1000}
                            src="/aboutus/showcase.jpg"
                            alt="Reconocimiento y prestigio"
                            className="w-full rounded-lg shadow-xl object-cover shadow-white/20" />
                        <figcaption className="text-sm text-gray-500 mt-2">Nuestros bolsos en exhibiciones internacionales de lujo.</figcaption>
                    </figure>
                    <div className="md:w-2/3 text-center md:text-start">
                        <header>
                            <h2 className="text-3xl font-semibold mb-4 font-Quintessential">Reconocimiento y Prestigio</h2>
                        </header>
                        <p className="text-lg mb-4">
                            A lo largo de los años, nuestra marca ha ganado reconocimiento internacional por su compromiso con la calidad y el diseño. Nuestros bolsos han sido destacados en revistas de moda, exhibiciones de lujo y eventos exclusivos, consolidando nuestra posición como líderes en la industria.
                        </p>
                        <p className="text-lg mb-4">
                            Clientes de todo el mundo valoran nuestros productos por su combinación de lujo, funcionalidad y estilo atemporal. Cada bolso que fabricamos no solo es un accesorio, sino también una declaración de elegancia y sofisticación.
                        </p>
                    </div>
                </section>
            </article>
        </main>
    );
}