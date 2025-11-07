import StepSection from "../components/section/layanan/step";

export default function OrderPage() {
  return (
    <>
      <div className="py-20 mt-3">
        {/* Title Skema Layanan */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Skema Layanan
        </h2>

        <StepSection />
      </div>
    </>
  );
}
