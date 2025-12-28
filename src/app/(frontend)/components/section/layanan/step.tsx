"use client";

import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface Step {
  id: number;
  title: string;
  side: "start" | "end";
  description: string[];
}

export default function StepSection() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSteps() {
      const res = await fetch("/api/steppayment");
      const data: Step[] = await res.json();
      setSteps(data);
      setLoading(false);
    }
    fetchSteps();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <section
      className="
        relative
        bg-[url('/images/design/villa1.jpg')]
        bg-cover
        bg-center
        bg-fixed
        py-24
      "
    >
      {/* overlay global */}
      <div className="absolute inset-0 bg-black/20" />

      {/* content */}
      <div className="relative max-w-5xl mx-auto px-4">
        <h2 className="text-5xl font-semibold text-center mb-12 text-white">
          Skema Layanan
        </h2>

        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {steps.map((step, index) => (
            <li key={step.id} data-aos="fade-up">
              {index !== 0 && <hr />}

              <div className="timeline-middle m-4 text-[#ff4757]">
                <FaCheckCircle />
              </div>

              <div
                className={`timeline-${step.side} mb-10 ${
                  step.side === "start" ? "md:text-end" : ""
                }`}
              >
                {/* GLASS CARD */}
                <div
                  className="
                    inline-block
                    rounded-2xl
                    bg-white/70
                    backdrop-blur-md
                    shadow-lg
                    p-6
                    max-w-md
                  "
                >
                  <div className="text-lg font-black text-[#2E2B25] mb-2">
                    {step.title}
                  </div>

                  <div className="space-y-1">
                    {step.description.map((desc, i) => (
                      <p key={i} className="text-gray-700 text-sm">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <hr />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
