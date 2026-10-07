import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { makeReference, storeRecord } from "../lib/booking";

export default function Enquiry() {
    const [sent, setSent] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const record = storeRecord({
            kind: "enquiry",
            reference: makeReference("E"),
            name: String(data.get("name") ?? "").trim(),
            contact: String(data.get("contact") ?? "").trim(),
            service: String(data.get("service") ?? "") || "Not specified",
            date: String(data.get("date") ?? ""),
            message: String(data.get("message") ?? "").trim(),
            createdAt: new Date().toISOString(),
        });
        setSent(record);
    };

    return (
        <section className="enquiry-wrap" id="enquiry">
            <div className="container enquiry">
                <div className="enquiry-copy">
                    <span className="eyebrow">
                        <span className="eyebrow-line" /> 
                            LET'S PLAN SOMETHING GOOD
                    </span>
                    <h2>Your trip.<br />
                        <em>Your way.</em>
                    </h2>
                    <p>Have a date in mind or just dreaming? Tell us a little about your journey and we’ll take it from there.</p>
                    <div className="enquiry-contact">✳ <span>Thoughtful planning starts here.</span></div>
                </div>

                {sent ? (
                    <div className="enquiry-success">
                        <span className="success-icon">
                            <Check size={26} />
                        </span>
                        <h3>Enquiry received.</h3>
                        <p>Thanks{sent.name ? `, ${sent.name.split(" ")[0]}` : ""} — we’ll get back to you within a day.</p>
                        <span className="success-ref">{sent.reference}</span>
                        <button type="button" className="button button-dark" onClick={() => setSent(null)}>
                            Send another enquiry
                        </button>
                    </div>
                ) : (
                    <form className="enquiry-form" onSubmit={handleSubmit}>
                        <div className="form-heading">
                            <h3>Plan your journey</h3>
                            <span>01 — YOUR DETAILS</span>
                        </div>

                        <label>
                            Your name
                            <input type="text" name="name" required placeholder="e.g. Amit Sharma" />
                        </label>
                        <label>
                            Email or phone
                            <input type="text" name="contact" required placeholder="How can we reach you?" />
                        </label>

                        <div className="form-two">
                            <label>I'm interested in
                                <select name="service" defaultValue="">
                                    <option value="" disabled>Select a service</option>
                                    <option>Boat ride</option>
                                    <option>Hotel / stay</option>
                                    <option>Local experience</option>
                                    <option>Travel assistance</option>
                                    <option>Multiple services</option>
                                </select>
                            </label>
                            <label>
                                Travel date
                                <input type="date" name="date" />
                            </label>
                        </div>
                        <label>
                            Tell us about your plan
                            <textarea name="message" rows="3" placeholder="Number of people, preferences, questions..." />
                        </label>
                        <button className="button button-dark form-submit" type="submit">
                            Send an enquiry
                            <ArrowRight size={18} />
                        </button>
                        <small className="form-footnote">
                            No payment required. We’ll get back to you with the details.
                        </small>
                    </form>
                )}
            </div>
        </section>
    );
}
