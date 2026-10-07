import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";
import { boats } from "../data/boats";
import {
    addDaysISO,
    clamp,
    formatDate,
    formatINR,
    isValidISODate,
    makeReference,
    storeRecord,
    todayISO,
} from "../lib/booking";
import Stepper from "../components/Stepper";
import BookingSuccess from "../components/BookingSuccess";

const PHONE_RE = /^[+\d][\d\s-]{7,}$/;

export default function BoatsPage() {
    const [params] = useSearchParams();
    const today = todayISO();

    const initialBoat = boats.find((b) => b.id === params.get("ride")) ?? boats[0];
    const paramDate = params.get("date");
    const paramGuests = Number(params.get("guests"));

    const [boatId, setBoatId] = useState(initialBoat.id);
    const [slot, setSlot] = useState(initialBoat.slots[0]);
    const [date, setDate] = useState(
        isValidISODate(paramDate) && paramDate >= today ? paramDate : today
    );
    const [guests, setGuests] = useState(
        clamp(Number.isFinite(paramGuests) && paramGuests > 0 ? paramGuests : 2, 1, initialBoat.maxGuests)
    );
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});
    const [confirmed, setConfirmed] = useState(null);

    const boat = boats.find((b) => b.id === boatId);

    const total = useMemo(
        () => (boat.unit === "person" ? boat.price * guests : boat.price),
        [boat, guests]
    );

    const selectBoat = (next) => {
        setBoatId(next.id);
        setSlot(next.slots[0]);
        setGuests((g) => clamp(g, 1, next.maxGuests));
    };

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!isValidISODate(date) || date < today) next.date = "Pick a date from today onwards.";
        if (!name.trim()) next.name = "Please tell us your name.";
        if (!PHONE_RE.test(phone.trim())) next.phone = "Add a phone number we can reach you on.";
        setErrors(next);
        if (Object.keys(next).length) return;

        setConfirmed(
            storeRecord({
                kind: "boat",
                reference: makeReference("B"),
                ride: boat.name,
                date,
                slot,
                guests,
                total,
                name: name.trim(),
                phone: phone.trim(),
                notes: notes.trim(),
                createdAt: new Date().toISOString(),
            })
        );
    };

    if (confirmed) {
        return (
            <main className="booking-page">
                <section className="booking-section container">
                    <BookingSuccess
                        reference={confirmed.reference}
                        title="Your boat ride is booked."
                        note={`See you at ${confirmed.slot} — we'll call to confirm the meeting point.`}
                        lines={[
                            ["Ride", confirmed.ride],
                            ["Date", formatDate(confirmed.date)],
                            ["Boarding", confirmed.slot],
                            ["Guests", `${confirmed.guests}`],
                        ]}
                        total={formatINR(confirmed.total)}
                        resetLabel="Book another ride"
                        onReset={() => setConfirmed(null)}
                    />
                </section>
            </main>
        );
    }

    return (
        <main className="booking-page">
            <section className="page-hero">
                <div className="container">
                    <span className="eyebrow">
                        <span className="eyebrow-line" />BOAT RIDES ON THE GANGES
                    </span>
                    <h1>
                        Pick your boat.<br />
                        <em>We'll take it from there.</em>
                    </h1>
                    <p>
                        Choose a ride, a time and how many are coming. Your booking is confirmed
                        instantly and paid at the ghat — no advance needed.
                    </p>
                    <div className="page-hero-meta">
                        <span><ShieldCheck size={15} />No advance payment</span>
                        <span><Users size={15} />Private & shared boats</span>
                        <span><MapPin size={15} />Dashashwamedh Ghat pickup</span>
                    </div>
                </div>
            </section>

            <section className="booking-section">
                <form className="container booking-layout" onSubmit={submit} noValidate>
                    <div className="booking-panel">
                        <div className="booking-step">
                            <span className="step-num">01</span>
                            <div>
                                <h2>Choose your ride</h2>
                                <p>Every ride includes a local boatman who knows the river.</p>
                            </div>
                        </div>
                        <div className="option-grid">
                            {boats.map((b) => (
                                <button
                                    type="button"
                                    key={b.id}
                                    className={"option-card" + (b.id === boatId ? " selected" : "")}
                                    aria-pressed={b.id === boatId}
                                    onClick={() => selectBoat(b)}
                                >
                                    <span className="option-media">
                                        <img src={b.image} alt={b.name} />
                                        {b.id === boatId && (
                                            <span className="option-check"><Check size={14} /></span>
                                        )}
                                    </span>
                                    <span className="option-body">
                                        <strong>{b.name}</strong>
                                        <small>{b.duration} · up to {b.maxGuests} guests</small>
                                        <span className="option-price">
                                            {formatINR(b.price)}
                                            <small>{b.unit === "person" ? " / person" : " / boat"}</small>
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="booking-step">
                            <span className="step-num">02</span>
                            <div>
                                <h2>Pick a date & time</h2>
                                <p>Sunrise fills up fast — book a day ahead if you can.</p>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="boat-date">Date</label>
                            <input
                                id="boat-date"
                                type="date"
                                min={today}
                                max={addDaysISO(today, 90)}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={errors.date ? "invalid" : ""}
                                aria-invalid={Boolean(errors.date)}
                            />
                            {errors.date && <span className="field-error">{errors.date}</span>}
                        </div>
                        <div className="form-field">
                            <span className="form-label">Boarding time</span>
                            <div className="slot-grid">
                                {boat.slots.map((s) => (
                                    <button
                                        type="button"
                                        key={s}
                                        className={"slot-chip" + (s === slot ? " active" : "")}
                                        aria-pressed={s === slot}
                                        onClick={() => setSlot(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="booking-step">
                            <span className="step-num">03</span>
                            <div>
                                <h2>Guests & contact</h2>
                                <p>We'll call to confirm the meeting spot on the day.</p>
                            </div>
                        </div>
                        <Stepper
                            label="Guests"
                            value={guests}
                            onChange={setGuests}
                            max={boat.maxGuests}
                            hint={`This ride fits up to ${boat.maxGuests}`}
                        />
                        <div className="field-row">
                            <div className="form-field">
                                <label htmlFor="boat-name">Your name</label>
                                <input
                                    id="boat-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Amit Sharma"
                                    className={errors.name ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.name)}
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="boat-phone">Phone number</label>
                                <input
                                    id="boat-phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className={errors.phone ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.phone)}
                                />
                                {errors.phone && <span className="field-error">{errors.phone}</span>}
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="boat-notes">Anything else? <span className="form-optional">(optional)</span></label>
                            <textarea
                                id="boat-notes"
                                rows="3"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Kids on board, photo spots, questions..."
                            />
                        </div>
                    </div>

                    <aside className="booking-summary">
                        <span className="summary-kicker">YOUR BOOKING</span>
                        <h3>{boat.name}</h3>
                        <p className="summary-sub">{boat.tagline}</p>
                        <div className="summary-lines">
                            <div className="summary-line"><span>Date</span><b>{formatDate(date)}</b></div>
                            <div className="summary-line"><span>Boarding</span><b>{slot}</b></div>
                            <div className="summary-line">
                                <span>Guests</span>
                                <b>{guests} {guests === 1 ? "guest" : "guests"}</b>
                            </div>
                            <div className="summary-line">
                                <span>{boat.unit === "person" ? "Price per person" : "Charter price"}</span>
                                <b>{formatINR(boat.price)}</b>
                            </div>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <b>{formatINR(total)}</b>
                        </div>
                        <button className="button button-accent summary-confirm" type="submit">
                            Confirm booking
                        </button>
                        <div className="summary-note">
                            <Clock3 size={14} />
                            <span>Free cancellation up to 24 hours before.</span>
                        </div>
                        <ul className="summary-includes">
                            {boat.includes.map((item) => (
                                <li key={item}><Check size={13} />{item}</li>
                            ))}
                        </ul>
                    </aside>
                </form>
            </section>
        </main>
    );
}
