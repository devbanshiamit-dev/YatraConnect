import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Experiences from "./components/Experiences";
import WhyChooseUs from "./components/WhyChooseUs";
import Enquiry from "./components/Enquiry";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Experiences />
        <WhyChooseUs />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}