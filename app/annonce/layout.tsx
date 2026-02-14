import Stepper from "@/components/Stepper";

export default function AnnonceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Stepper />
      {children}
    </div>
  );
}
