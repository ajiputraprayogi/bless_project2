// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import GradualBlur from "./components/layout/gradual";
import Navbar from "./components/layout/Navbar";
import AOSInitializer from "./components/layout/AOSinitializer";
import { Outfit } from "next/font/google";

// ⬇️ IMPORT WRAPPER CLIENT
import FooterWrapper from "./components/layout/footerwrapper";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Bless Luxury Contractor",
  description: "Kontraktor Site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AOSInitializer />
        <section className="relative min-h-screen overflow-hidden">
          <div className="h-full">
            <Navbar />
            {/* <div className="mt-[5rem]"></div> */}
            {children}

            {/* Footer otomatis hide di slug */}
            <FooterWrapper />
          </div>

          <div className="fixed bottom-0 left-0 w-full pointer-events-none">
            <GradualBlur
              target="parent"
              position="bottom"
              height="3rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential={true}
              opacity={1}
            />
          </div>
        </section>
      </body>
    </html>
  );
}
