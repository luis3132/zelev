import MainNavbar from "@/components/navbar/MainNavbar";

export default function AboutUsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <MainNavbar />
            <div className="w-full h-dvh md:pt-20">
                {children}
            </div>
        </>
    );
}