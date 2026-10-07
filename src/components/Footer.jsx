import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    const backToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">
                    <Link className="brand footer-brand" to="/">
                        <span className="brand-mark">Y</span>
                        <span>
                            Yatra
                            <span className="brand-light">
                                Connect
                            </span>
                        </span>
                    </Link>
                    <p>Closer to the places.<br />Closer to the feeling.</p>
                    <button type="button" className="footer-top" onClick={backToTop}>
                        Back to top ↑
                    </button>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 YatraConnect</span>
                    <span>Made for journeys in Varanasi, India</span>
                    <span>
                        <Link to="/#services">
                            Explore
                            <ArrowUpRight size={13} />
                        </Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
