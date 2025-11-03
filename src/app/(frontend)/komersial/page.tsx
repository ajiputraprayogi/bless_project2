import Image from "next/image"
import DesignCategories from "../components/section/home/card"

export default function ArsitekPage() {

    return(
        <>
              <section className="relative w-full h-[50vh]">
                <Image
                  src="/images/design/6.png"
                  alt="Background Hero"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h1 className="text-4xl md:text-5xl text-white text-center px-4">
                    Desain Komersial
                  </h1>
                </div>
              </section>

              <DesignCategories />
        </>
    )
}