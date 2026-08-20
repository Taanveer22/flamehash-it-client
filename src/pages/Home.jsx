import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Projects from "./Projects";
import Services from "./Services";
import Testimonials from "./Testimonials";
import AboutUs from "./AboutUs";
import Contact from "./Contact";

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
        <Services></Services>
      </div>
      <div className="mb-8 lg:mb-16">
        <Projects></Projects>
      </div>
      <div className="mb-8 lg:mb-16">
        <AboutUs></AboutUs>
      </div>
      <div className="mb-8 lg:mb-16">
        <Testimonials></Testimonials>
      </div>
      <div className="mb-8 lg:mb-16">
        <Contact></Contact>
      </div>
    </section>
  );
};

export default Home;
