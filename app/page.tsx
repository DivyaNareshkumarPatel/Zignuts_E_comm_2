import HomeCTA from "@/app/components/home/HomeCTA";
import HomeFeatures from "@/app/components/home/HomeFeatures";
import HomeGallery from "@/app/components/home/HomeGallery";
import HomeHero from "@/app/components/home/HomeHero";

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <HomeHero />
      <HomeFeatures />
      <HomeGallery />
      <HomeCTA />
    </main>
  );
}
