"use client";

import { motion } from "framer-motion";

type Props = {
  phone: string; // format: 628xxxx (tanpa +)
  message?: string;
};

export default function WhatsappCTA({
  phone,
  message = "Halo, saya tertarik dengan produk ini",
}: Props) {
  const handleClick = () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.7, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl ring-2 ring-green-200/50"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-white/20"
          animate={{ opacity: [0.45, 0.05, 0.45], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          whileTap={{ rotate: [0, -15, 15, 0], scale: [1, 0.95, 1.1, 1] }}
          transition={{ duration: 0.25 }}
        >
          <path d="M20.52 3.48A11.82 11.82 0 0012.05 0C5.41 0 .02 5.39.02 12.03c0 2.12.55 4.19 1.6 6.02L0 24l6.1-1.6a11.98 11.98 0 005.95 1.52h.01c6.64 0 12.03-5.39 12.03-12.03 0-3.21-1.25-6.22-3.57-8.41zM12.06 21.5c-1.81 0-3.58-.49-5.13-1.42l-.37-.22-3.62.95.97-3.53-.24-.36a9.45 9.45 0 01-1.46-5.01c0-5.23 4.25-9.48 9.48-9.48 2.53 0 4.91.99 6.7 2.78a9.42 9.42 0 012.77 6.7c0 5.23-4.25 9.48-9.48 9.48zm5.28-7.11c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.37-.02-.52-.07-.15-.65-1.56-.9-2.13-.24-.57-.48-.49-.65-.5h-.56c-.19 0-.5.07-.76.37-.26.29-1 1-.99 2.43.01 1.43 1.03 2.81 1.17 3 .15.19 2.03 3.1 4.92 4.34.69.3 1.23.48 1.65.61.69.22 1.31.19 1.8.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.27.17-1.38-.07-.12-.26-.19-.55-.34z" />
        </motion.svg>
      </motion.button>
    </div>
  );
}