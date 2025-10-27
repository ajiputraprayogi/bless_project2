"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 800, // durasi animasi ms
      once: false,   // false = animasi jalan tiap kali scroll
      offset: 100,   // jarak sebelum trigger
      // mirror: true,
    });
  }, []);

  return null; // ga render apa2, cuma init
}
