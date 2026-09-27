import { ArrowRight, MapPin, CalendarDays, Users } from "lucide-react";
import heroImage from '../images/heroimage.jpg';

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="eyebrow-line" />
          YOUR JOURNEY, OUR CONNECTION
        </div>
        <h1>
          Find your
          <em>peace</em>
          <br />
          on the river.
        </h1>
        <p className="hero-description">
          Discover the soul of Varanasi with unforgettable boat rides, stays and local experiences—planned just for you.
        </p>
        <div className="hero-actions">
          <a className="button button-dark" href="#experiences">
            Explore experiences
            <ArrowRight size={18} />
          </a>
          <a className="text-link" href="#about">
            How it works
            <span>↗</span>
          </a>
        </div>
        <div className="hero-note">
          <div className="avatar-stack">
            <i>✦</i>
            <i>न</i>
            <i>✺</i>
          </div>
          <span>
            <b>
              Made for curious travellers
            </b>
            <small>
              Local experiences. Personal planning.
            </small>
          </span>
        </div>
      </div>
      <div className="hero-visual">
        <img src={heroImage} alt="Varanasi river and ghats" />
        <div className="image-shade" />
        <div className="image-label">
          <span className="live-dot" />
          VARANASI, INDIA
          <span>25°19′N 83°00′E</span>
        </div>
        <div className="floating-card">
          <span className="float-icon">
            ✺
          </span>
          <div>
            <b>Moments that stay</b>
            <small>Experiences worth remembering</small>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <span>01 / 04</span>
        <span className="bottom-line" />
        <span>THE CITY OF LIGHT</span>
      </div>
    </section>
  );
}