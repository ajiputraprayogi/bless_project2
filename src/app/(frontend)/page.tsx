"use client";

import { useRef } from "react";
import HeroSection from "./components/section/home/heroSection";
import DesignCategories from "./components/section/home/card";
import FurnitureHero from "./components/section/home/furniture";
import AboutStatsPage from "./components/section/home/satisfied";
import KelebihanKekuranganPage from "./components/section/kelebihan";

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2E2B25]">
      <HeroSection onExploreClick={handleScroll} />

      {/* Bungkus section card pakai div dengan ref */}
      <div ref={sectionRef}>
        <DesignCategories />
      </div>

      {/* Satisfied Client */}
      {/* <AboutStatsPage /> */}

      {/* Furniture */}
      <FurnitureHero/>

      {/* kelebihan */}
      <KelebihanKekuranganPage />
      
    </div>
  );
}
