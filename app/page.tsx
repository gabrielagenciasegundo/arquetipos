import FirstPage from "@/components/FirstPage";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-transparent text-foreground flex flex-col justify-center items-center py-12 px-4">
      <Image className="pb-8 md:top-8" src='/agencia-segundo_cut.png' width={500} height={500} alt='Logo' />
      <FirstPage />
    </div>
  );
}
