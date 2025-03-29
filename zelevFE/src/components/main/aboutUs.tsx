import Image from "next/image";
import Link from "next/link";


export default function AboutUs() {
    return (
        <>
            <div className="h-full md:p-1 p-6 flex items-center">
                <Link className="" href="/AboutUs">
                    <figure className="relative w-full cursor-pointer rounded-2xl overflow-hidden">
                        <Image
                            src={"/logo/largeLogo.webp"}
                            width={1000}
                            height={1000}
                            priority
                            alt="logo de la empresa que es un bolso de mano con las letras Z y V" />
                        <figcaption className="absolute inset-0 flex items-start justify-center pt-2 max-sm:hidden">
                            <p className="text-white font-Quintessential text-lg font-bold max-md:text-sm">Acerca de Nosotros</p>
                        </figcaption>
                    </figure>
                </Link>
            </div>
        </>
    )
}