import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SearchProvider } from "@/context/SearchProvider";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
