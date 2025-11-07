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
      const res = await fetch("/dummyapi/step");
      const data: Step[] = await res.json();
      setSteps(data);
      setLoading(false);
    }
    fetchSteps();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {steps.map((step, index) => (
        <li key={step.id} data-aos="fade-up">
          {index !== 0 && <hr />}
          <div className="timeline-middle m-4">
            <FaCheckCircle />
          </div>
          <div
            className={`timeline-${step.side} mb-10 ${
              step.side === "start" ? "md:text-end" : ""
            }`}
          >
            <div className="text-xl font-black text-[#2E2B25]">{step.title}</div>
            {step.description.map((desc, i) => (
              <p key={i}>{desc}</p>
            ))}
          </div>
          <hr />
        </li>
      ))}
    </ul>
  );
}
