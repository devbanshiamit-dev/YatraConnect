import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import SectionTitle from "./SectionTitle";
import sunriseBoat from "../images/sunrice.jpg";
import aarti from "../images/aarti.jpg";
import street from "../images/street.jpg";


const experiences =
    [
        {
            name: "The sunrise boat ride",
            type: "BOAT EXPERIENCE",
            time: "1–2 hours",
            place: "Dashashwamedh Ghat",
            image: sunriseBoat
        },
        {
            name: "Evening Ganga Aarti",
            type: "CULTURAL EXPERIENCE",
            time: "2 hours",
            place: "Assi Ghat",
            image: aarti
        },
        {
            name: "Old city walk",
            type: "LOCAL EXPERIENCE",
            time: "2–3 hours",
            place: "Varanasi Old City",
            image: street
        }
    ];
export default function Experiences() {
    return (
        <section className="section experiences" id="experiences">
            <div className="container">
                <div className="section-row">
                    <SectionTitle kicker="THE YATRA EDIT" title={<>A little taste of<br /><em>Varanasi.</em></>} />
                    <p className="section-intro">From quiet mornings on the river to the energy of the ghats,
                        find an experience that feels like yours.</p>
                </div>
                < div className="experience-grid">
                    {experiences.map((x, i) => <article className="experience-card" key={x.name}>
                        <div className="experience-image">
                            <img src={x.image} alt={x.name} />
                            <span className="experience-tag">
                                {x.type}
                            </span>
                            <a href="#enquiry" className="round-arrow" aria-label={"Enquire about " + x.name}>
                                <ArrowUpRight />
                            </a>
                        </div>
                        <div className="experience-info">
                            <h3>{x.name}</h3>
                            <div className="experience-meta">
                                <span><MapPin size={14} />{x.place}</span>
                                <span><Clock3 size={14} />{x.time}</span>
                            </div>
                        </div>
                    </article>)}
                </div>
            </div>
        </section>
    );
}