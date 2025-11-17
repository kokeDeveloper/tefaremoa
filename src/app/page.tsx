import AboutClass from "./components/AboutClass";
import BannerVideo from "./components/BannerVideo";
import CarouselTefare from "./components/CarouselTefare";
import TrialCTA from "./components/TrialCTA";
import UpcomingWorkshops from "./components/UpcomingWorkshops";
import Testimonials from "./components/Testimonials";


export default function Home() {
  return (
    <>
      <main>
        <BannerVideo />
        <CarouselTefare />
        <TrialCTA />
        {/*<UpcomingWorkshops /> */}
        {/*<Testimonials />*/}
        <AboutClass />
      </main>
    </>
  );
}
