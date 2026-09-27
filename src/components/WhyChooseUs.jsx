import { HeartHandshake, ShieldCheck, MessageCircle, Sparkles } from "lucide-react";
import SectionTitle from "./SectionTitle";

const points = [
    {
        icon: HeartHandshake,
        title: "Personal, not packaged",
        desc: "Tell us what you have in mind. We help shape a trip around you."
    },
    {
        icon: ShieldCheck,
        title: "Local knowledge",
        desc: "Get practical guidance and connect with local service providers."
    },
    {
        icon: MessageCircle,
        title: "One simple enquiry",
        desc: "Share your plans once and let us help coordinate the details."
    },
    {
        icon: Sparkles,
        title: "Made for memories",
        desc: "Spend less time figuring things out and more time being there."
    }
];
export default function WhyChooseUs() {
    return (
        <section className="section container why" id="about">
            <div className="why-copy">
                <SectionTitle kicker="THE YATRACONNECT WAY"
                    title={<>Good journeys<br />start with a <em>hello.</em></>} />
                <p>Every traveller is different. That’s why we keep planning personal,
                    thoughtful and easy—from your first question to the day you arrive.</p>
                <a className="text-link" href="#enquiry">
                    Get to know us
                    <span>↗</span>
                </a>
            </div>
            <div className="why-grid">
                {points.map((p, i) =>
                    <div className="why-item" key={p.title}>
                        <span className="why-icon">
                            <p.icon size={21} />
                        </span>
                        <span className="why-num">
                            0{i + 1}
                        </span>
                        <h3>{p.title}</h3>
                        <p>{p.desc}</p>
                    </div>)}
            </div>
        </section>
    );
}