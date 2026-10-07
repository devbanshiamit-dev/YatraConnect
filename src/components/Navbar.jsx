import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const activeClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">Y</span>
          <span>Yatra<span className="brand-light">Connect</span></span>
        </Link>
        <div className={`nav-content ${isMenuOpen ? "is-open" : ""}`} id="primary-navigation">
          <div className="nav-links">
            <NavLink to="/" end className={activeClass} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/boats" className={activeClass} onClick={closeMenu}>Boat rides</NavLink>
            <NavLink to="/rooms" className={activeClass} onClick={closeMenu}>Stays</NavLink>
            <Link to="/#experiences" onClick={closeMenu}>Experiences</Link>
            <Link to="/#about" onClick={closeMenu}>About us</Link>
          </div>
          <Link className="nav-cta" to="/#enquiry" onClick={closeMenu}>Plan your trip <ArrowUpRight size={17} /></Link>
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
