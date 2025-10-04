import AboutClass from "./components/AboutClass";
import { BannerMoon } from "./components/bannerMoon";
import BannerVideo from "./components/BannerVideo";
import CarouselTefare from "./components/CarouselTefare";


export default function Home() {
  return (
    <>
      <main>
        <BannerVideo />
        <CarouselTefare />
        <AboutClass />
      </main>
    </>
  );
}
