import NavbarLogOut from "@/components/navbar/NavbarLogOut";


export default function AboutUsLayout({
    children,
    }: Readonly<{
    children: React.ReactNode;
    }>) {
    return (
        <>
            <NavbarLogOut />
            {children}
        </>
    );
    }