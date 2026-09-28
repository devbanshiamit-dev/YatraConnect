import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar container">
        <a className="brand" href="#" onClick={closeMenu}>
          <span className="brand-mark">Y</span>
          <span>Yatra<span className="brand-light">Connect</span></span>
        </a>
        <div className={`nav-content ${isMenuOpen ? "is-open" : ""}`} id="primary-navigation">
          <div className="nav-links">
            <a className="active" href="#" onClick={closeMenu}>Home</a>
            <a href="#experiences" onClick={closeMenu}>Experiences</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#about" onClick={closeMenu}>About us</a>
          </div>
          <a className="nav-cta" href="#enquiry" onClick={closeMenu}>Plan your trip <ArrowUpRight size={17}/></a>
        </div>
        <button
          className="menu-button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}