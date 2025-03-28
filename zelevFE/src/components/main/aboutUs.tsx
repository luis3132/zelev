import Image from "next/image";
import Link from "next/link";


export default function AboutUs() {
    return (
        <>
            <Link href="/" className="relative w-full h-full">
                <Image src={"/logo/largeLogo.webp"} width={1000} height={1000} alt="logo de la empresa que es un bolso de mano con las letras Z y V" />
                <div className="absolute inset-0 flex items-end justify-center">
                    <p className="text-white font-Quintessential text-lg font-bold max-md:text-sm">Acerca de Nosotros</p>
                </div>
            </Link>
        </>
    )
}