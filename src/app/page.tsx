import Navbar from "./components/Navbar";
import HeroBanner from "./components/Hero";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import { BannerClases } from "./components/bannerClases";


export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <Welcome />
        <BannerClases />
      </main>
    </>
  );
}
