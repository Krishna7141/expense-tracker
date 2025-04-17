import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "KashFlow",
	description: "Krishna Vamshi Kusuma",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
        <ClerkProvider
            afterSignOutUrl={"/sign-in"}
            appearance={{
                variables: {
                    // colorPrimary: "#0052FF",
                    colorPrimary: "blue",
                },
            }}
        >
            <html lang="en" className="light" style={{colorScheme: "light"}}>
                <body className={inter.className}>
                    <RootProviders>
                        <Toaster/>
                        {/* <Navbar/> */}
                        {children}
                    </RootProviders>
                </body>
            </html>
        </ClerkProvider>
	);
}
