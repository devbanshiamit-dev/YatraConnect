import { Menu, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar container">
        <a className="brand" href="#">
          <span className="brand-mark">Y</span>
          <span>Yatra<span className="brand-light">Connect</span></span>
        </a>
        <div className="nav-links">
          <a className="active" href="#">Home</a>
          <a href="#experiences">Experiences</a>
          <a href="#services">Services</a>
          <a href="#about">About us</a>
        </div>
        <a className="nav-cta" href="#enquiry">Plan your trip <ArrowUpRight size={17}/></a>
        <button className="menu-button" aria-label="Menu"><Menu/></button>
      </nav>
    </header>
  );
}