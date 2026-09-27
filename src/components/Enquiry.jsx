import { ArrowRight, CalendarDays, UserRound, MapPin } from "lucide-react";

export default function Enquiry() {

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

                <form className="enquiry-form">
                    <div className="form-heading">
                        <h3>Plan your journey</h3>
                        <span>01 — YOUR DETAILS</span>
                    </div>

                    <label>
                        Your name
                        <input type="text" placeholder="e.g. Amit Sharma" />
                    </label>
                    <label>
                        Email or phone
                        <input type="text" placeholder="How can we reach you?" />
                    </label>

                    <div className="form-two">
                        <label>I'm interested in
                            <select defaultValue="">
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
                            <input type="date" />
                        </label>
                    </div>
                    <label>
                        Tell us about your plan
                        <textarea rows="3" placeholder="Number of people, preferences, questions..." />
                    </label>
                    <button className="button button-dark form-submit" type="button">
                        Send an enquiry
                        <ArrowRight size={18} />
                    </button>
                    <small className="form-footnote">
                        No payment required. We’ll get back to you with the details.
                    </small>
                </form>
            </div>
        </section>
    );
}