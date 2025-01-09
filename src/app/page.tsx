import AboutClass from "./components/AboutClass";
import BannerVideo from "./components/BannerVideo";
import CarouselTefare from "./components/CarouselTefare";
import HeroBanner from "./components/Hero";
import { Welcome } from "./components/Welcome";
import { BannerClases } from "./components/bannerClases";
import { BannerMoon } from "./components/bannerMoon";
import { Carousel } from "./components/welcomeCarousel";


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
