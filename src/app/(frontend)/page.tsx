"use client";

import { useRef } from "react";
import HeroSection from "./components/section/home/heroSection";
import DesignCategories from "./components/section/home/card";
import FurnitureHero from "./components/section/home/furniture";
import AboutStatsPage from "./components/section/home/satisfied";
import KelebihanKekuranganPage from "./components/section/kelebihan";
import WhyChooseUs from "./components/atomic/PilihKami";
import PortfolioPage from "./trash/portfolio2";

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2E2B25]">
      <HeroSection onExploreClick={handleScroll} />

      <WhyChooseUs />

      {/* Bungkus section card pakai div dengan ref */}
      <div ref={sectionRef}>
        <PortfolioPage />
        {/* <DesignCategories /> */}
      </div>

      {/* Portfolio */}
      {/* <PortfolioPage /> */}


      {/* Satisfied Client */}
      {/* <AboutStatsPage /> */}

      {/* Furniture */}
      <FurnitureHero/>

      {/* kelebihan */}
      {/* <KelebihanKekuranganPage /> */}
      
    </div>
  );
}
