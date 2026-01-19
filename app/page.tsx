import FirstPage from "@/components/FirstPage";
import Image from "next/image";
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-transparent text-foreground flex flex-col justify-center items-center py-12 px-4">
      <div className="md:hidden">
        <Image className="hidden dark:block pb-8 md:top-8" src='/logo_white.png' width={150} height={500} alt='Logo' />
        <Image className="dark:hidden pb-8 md:top-8" src='/agencia-segundo_cut.png' width={150} height={500} alt='Logo' />
      </div>
      <div className="hidden md:block lg:hidden">
        <Image className="hidden dark:block pb-8 md:top-8" src='/logo_white.png' width={250} height={500} alt='Logo' />
        <Image className="dark:hidden pb-8 md:top-8" src='/agencia-segundo_cut.png' width={250} height={500} alt='Logo' />
      </div>
      <div className="hidden lg:block">
        <Image className="hidden dark:block pb-8 md:top-8" src='/logo_white.png' width={300} height={500} alt='Logo' />
        <Image className="dark:hidden pb-8 md:top-8" src='/agencia-segundo_cut.png' width={300} height={500} alt='Logo' />
      </div>
      <FirstPage />
    </div>
  );
}
