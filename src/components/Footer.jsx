import { ArrowUpRight } from "lucide-react";
export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">
                    <a className="brand footer-brand" href="#">
                        <span className="brand-mark">Y</span>
                        <span>
                            Yatra
                            <span className="brand-light">
                                Connect
                            </span>
                        </span>
                    </a>
                    <p>Closer to the places.<br />Closer to the feeling.</p>
                    <a className="footer-top" href="#">
                        Back to top ↑
                    </a>
                </div>
                <div className="footer-bottom">
                    <span>© 2026 YatraConnect</span>
                    <span>Made for journeys in Varanasi, India</span>
                    <span>
                        <a href="#services">
                            Explore
                            <ArrowUpRight size={13} />
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}