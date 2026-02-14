import "./globals.css";
import Providers from "./providers";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Abrajeimmo",
  description: "Plateforme immobilière moderne au Maroc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Providers>
        <TopNav />
        

        <main className="flex-1 py-8">
          {children}
        </main>
      </Providers>  
        <Footer />
      </body>
    </html>
  );
}
