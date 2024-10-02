import HeroBanner from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { BannerClases } from "./components/bannerClases";
import { BannerMoon } from "./components/bannerMoon";


export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <BannerMoon />
        <Welcome />
      </main>
    </>
  );
}
