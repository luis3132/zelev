import NavbarAdmin from "@/components/navbar/NavbarAdmin";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavbarAdmin />
            <div className="w-full h-dvh md:pt-24">
                {children}
            </div>
        </>
    );
}