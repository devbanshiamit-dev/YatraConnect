import { Ship, Hotel, Compass, Car, ArrowUpRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

const services = [
  { 
    icon: Ship,
    title: "Boat rides",
    desc: "Sunrise, sunset and private rides on the Ganges." 
  },
  { 
    icon: Hotel,
    title: "Stays & hotels",
    desc: "Find a comfortable stay close to the places you love." 
  },
  { 
    icon: Compass, 
    title: "Local experiences", 
    desc: "Explore culture, food and hidden gems with local hosts." 
  },
  { 
    icon: Car, 
    title: "Travel assistance", 
    desc: "Make getting around simple with helpful travel support." 
  }
];

export default function Services() {
  return (
    <section className="section container" id="services">
      <SectionTitle kicker="WHAT WE HELP WITH" title={<>Everything you need for a<br /><em>meaningful</em> journey.</>} />
      <div className="service-grid">
        {services.map((item, index) => <article className="service-card" key={item.title}>
          <div className="service-top">
            <span className="service-icon">
              <item.icon size={23} />
            </span>
            <span className="service-number">
              0{index + 1}
            </span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
          <a href="#enquiry" className="card-link">Explore <ArrowUpRight size={16} /></a>
        </article>)}
      </div>
    </section>
  );
}