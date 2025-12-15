import Header from "@/components/header/header";
import MapSection from "@/components/ui/Map/MapSection";
import "./globals.css";
import MapScriptLoader from "@/components/ui/Map/mapScriptLoader";
import MapCanvas from "@/components/ui/Map/mapCanvars";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MapScriptLoader />
        <Header />
        <main className="pl-16 lg:pl-20 min-h-screen relative overflow-hidden">
          <MapCanvas />
          <div className="relative z-10 w-full h-full">
            <MapSection />
            <div className="w-full h-full bg-white bg-opacity-70">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
