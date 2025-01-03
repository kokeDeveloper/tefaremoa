import AboutClass from "./components/AboutClass";
import BannerVideo from "./components/BannerVideo";
import HeroBanner from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { BannerClases } from "./components/bannerClases";
import { BannerMoon } from "./components/bannerMoon";


export default function Home() {
  return (
    <>
      <main>
        <BannerVideo />
        <Welcome />
        <AboutClass />
        <BannerMoon />
      </main>
    </>
  );
}
