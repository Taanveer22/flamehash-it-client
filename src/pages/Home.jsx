import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import Projects from "./Projects";
import Services from "./Services";
import Testimonials from "./Testimonials";

const Home = () => {
  return (
    <section>
      <div className="mb-8 lg:mb-16">
        <Carousel></Carousel>
      </div>
      <div className="mb-8 lg:mb-16">
        <Banner></Banner>
      </div>
      <div className="mb-8 lg:mb-16">
        <AboutUs></AboutUs>
      </div>
      <div className="mb-8 lg:mb-16">
        <Projects></Projects>
      </div>
      <div className="mb-8 lg:mb-16">
        <Services></Services>
      </div>
      <div className="mb-8 lg:mb-16">
        <Contact></Contact>
      </div>
      <div className="mb-8 lg:mb-16">
        <Testimonials></Testimonials>
      </div>
    </section>
  );
};

export default Home;