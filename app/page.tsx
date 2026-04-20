import HomeFeatured from "@/app/components/home/HomeFeatured";
import HomeHero from "@/app/components/home/HomeHero";
import HomeNav from "@/app/components/home/HomeNav";

export default function Home() {
  return (
    <main className="bg-slate-950 text-slate-900 pb-20">
      <HomeNav />
      <HomeHero />
      <HomeFeatured />
    </main>
  );
}
