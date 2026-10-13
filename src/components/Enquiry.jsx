import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { makeReference, storeRecord } from "../lib/booking";

export default function Enquiry() {
    const [sent, setSent] = useState(null);
    const [storageError, setStorageError] = useState("");
    const submitLock = useRef(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (submitLock.current) return;
        const data = new FormData(event.currentTarget);
        submitLock.current = true;
        const result = storeRecord({
            kind: "enquiry",
            reference: makeReference("E"),
            name: String(data.get("name") ?? "").trim(),
            contact: String(data.get("contact") ?? "").trim(),
            service: String(data.get("service") ?? "") || "Not specified",
            date: String(data.get("date") ?? ""),
            message: String(data.get("message") ?? "").trim(),
            createdAt: new Date().toISOString(),
        });
        if (result.success) setSent(result.record);
        else {
            submitLock.current = false;
            setStorageError("We could not save this enquiry on this device. Your entries are still here; check browser storage and try again.");
        }
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
                        <h3>{sent.error ? "Enquiry not saved." : "Enquiry saved on this device."}</h3>
                        <p>{sent.error || "This prototype does not send enquiries to a server or supplier."}</p>
                        {!sent.error && <span className="success-ref">{sent.reference}</span>}
                        <button type="button" className="button button-dark" onClick={() => { submitLock.current = false; setSent(null); }}>
                            Send another enquiry
                        </button>
                    </div>
                ) : (
                    <form className="enquiry-form" onSubmit={handleSubmit}>
                        {storageError && <p className="field-error" role="alert">{storageError}</p>}
                        <div className="form-heading">
                            <h3>Plan your journey</h3>
                            <span>01 — YOUR DETAILS</span>
                        </div>

                        <label>
                            Your name
                            <input type="text" name="name" required maxLength="100" onChange={() => setStorageError("")} placeholder="e.g. Amit Sharma" />
                        </label>
                        <label>
                            Email or phone
                            <input type="text" name="contact" required maxLength="160" onChange={() => setStorageError("")} placeholder="How can we reach you?" />
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
                            Saved locally on this device only; no message is sent to a server or supplier.
                        </small>
                    </form>
                )}
            </div>
        </section>
    );
}
