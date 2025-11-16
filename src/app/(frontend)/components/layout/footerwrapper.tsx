"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
//   const pathname = usePathname();

//   const isPortfolioSlugPage = /^\/portfolio\/[^/]+$/.test(pathname ?? "");

//   if (isPortfolioSlugPage) return null;

//   return <Footer />;
return (
    <Footer></Footer>
)
}
