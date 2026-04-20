import HomeCTA from "@/app/components/home/HomeCTA";
import HomeFeatures from "@/app/components/home/HomeFeatures";
import HomeFeatured from "@/app/components/home/HomeFeatured";
import HomeHero from "@/app/components/home/HomeHero";

export default function Home() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <HomeHero />
      <HomeFeatured />
      <HomeFeatures />
      <HomeCTA />
    </main>
  );
}
