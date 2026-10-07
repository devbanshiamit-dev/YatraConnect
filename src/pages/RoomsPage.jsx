import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BedDouble, Check, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";
import { GST_RATE, rooms } from "../data/rooms";
import {
    addDaysISO,
    clamp,
    formatDate,
    formatINR,
    isValidISODate,
    makeReference,
    nightsBetween,
    storeRecord,
    todayISO,
} from "../lib/booking";
import Stepper from "../components/Stepper";
import BookingSuccess from "../components/BookingSuccess";

const PHONE_RE = /^[+\d][\d\s-]{7,}$/;

export default function RoomsPage() {
    const [params] = useSearchParams();
    const today = todayISO();

    const initialRoom = rooms.find((r) => r.id === params.get("room")) ?? rooms[0];
    const paramDate = params.get("date");
    const paramGuests = Number(params.get("guests"));

    const initialCheckIn =
        isValidISODate(paramDate) && paramDate >= today ? paramDate : addDaysISO(today, 1);

    const [roomId, setRoomId] = useState(initialRoom.id);
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(addDaysISO(initialCheckIn, 2));
    const [guests, setGuests] = useState(
        clamp(Number.isFinite(paramGuests) && paramGuests > 0 ? paramGuests : 2, 1, initialRoom.maxGuests)
    );
    const [roomCount, setRoomCount] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});
    const [confirmed, setConfirmed] = useState(null);

    const room = rooms.find((r) => r.id === roomId);

    const datesValid = isValidISODate(checkIn) && isValidISODate(checkOut);
    const nights = datesValid ? Math.max(0, nightsBetween(checkIn, checkOut)) : 0;
    const subtotal = room.price * nights * roomCount;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;

    const selectRoom = (next) => {
        setRoomId(next.id);
        setGuests((g) => clamp(g, 1, next.maxGuests));
    };

    const updateCheckIn = (value) => {
        const stay = datesValid && nightsBetween(checkIn, checkOut) > 0
            ? nightsBetween(checkIn, checkOut)
            : 2;
        setCheckIn(value);
        if (!isValidISODate(checkOut) || (isValidISODate(value) && checkOut <= value)) {
            setCheckOut(addDaysISO(value, Math.max(1, stay)));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!isValidISODate(checkIn) || checkIn < today) next.date = "Pick a check-in date from today onwards.";
        if (!isValidISODate(checkOut) || nights < 1) next.date = "Check-out must be at least one night after check-in.";
        if (!name.trim()) next.name = "Please tell us your name.";
        if (!PHONE_RE.test(phone.trim())) next.phone = "Add a phone number we can reach you on.";
        setErrors(next);
        if (Object.keys(next).length) return;

        setConfirmed(
            storeRecord({
                kind: "room",
                reference: makeReference("R"),
                room: room.name,
                checkIn,
                checkOut,
                nights,
                guests,
                rooms: roomCount,
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
                        title="Your stay is booked."
                        note="We'll hold your room and call to confirm check-in details."
                        lines={[
                            ["Room", confirmed.room],
                            ["Check-in", formatDate(confirmed.checkIn)],
                            ["Check-out", formatDate(confirmed.checkOut)],
                            ["Nights", `${confirmed.nights}`],
                            ["Guests", `${confirmed.guests}`],
                            ["Rooms", `${confirmed.rooms}`],
                        ]}
                        total={formatINR(confirmed.total)}
                        resetLabel="Book another stay"
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
                        <span className="eyebrow-line" />STAYS IN VARANASI
                    </span>
                    <h1>
                        Find your room.<br />
                        <em>Stay a while.</em>
                    </h1>
                    <p>
                        Handpicked stays near the ghats — breakfast included, booked in a minute,
                        paid at check-in.
                    </p>
                    <div className="page-hero-meta">
                        <span><ShieldCheck size={15} />Pay at check-in</span>
                        <span><BedDouble size={15} />Breakfast included</span>
                        <span><Clock3 size={15} />Free cancellation up to 48h</span>
                    </div>
                </div>
            </section>

            <section className="booking-section">
                <form className="container booking-layout" onSubmit={submit} noValidate>
                    <div className="booking-panel">
                        <div className="booking-step">
                            <span className="step-num">01</span>
                            <div>
                                <h2>Choose your room</h2>
                                <p>Each stay is close to the river and the old city.</p>
                            </div>
                        </div>
                        <div className="option-grid">
                            {rooms.map((r) => (
                                <button
                                    type="button"
                                    key={r.id}
                                    className={"option-card" + (r.id === roomId ? " selected" : "")}
                                    aria-pressed={r.id === roomId}
                                    onClick={() => selectRoom(r)}
                                >
                                    <span className="option-media">
                                        <img src={r.image} alt={r.name} />
                                        {r.id === roomId && (
                                            <span className="option-check"><Check size={14} /></span>
                                        )}
                                    </span>
                                    <span className="option-body">
                                        <strong>{r.name}</strong>
                                        <small>{r.bed} · up to {r.maxGuests} guests</small>
                                        <span className="option-price">
                                            {formatINR(r.price)}
                                            <small> / night</small>
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="booking-step">
                            <span className="step-num">02</span>
                            <div>
                                <h2>Check-in & check-out</h2>
                                <p>Check-in from 1 PM, check-out by 11 AM.</p>
                            </div>
                        </div>
                        <div className="field-row">
                            <div className="form-field">
                                <label htmlFor="room-checkin">Check-in</label>
                                <input
                                    id="room-checkin"
                                    type="date"
                                    min={today}
                                    max={addDaysISO(today, 90)}
                                    value={checkIn}
                                    onChange={(e) => updateCheckIn(e.target.value)}
                                    className={errors.date ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.date)}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="room-checkout">Check-out</label>
                                <input
                                    id="room-checkout"
                                    type="date"
                                    min={addDaysISO(checkIn, 1)}
                                    max={addDaysISO(checkIn, 90)}
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className={errors.date ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.date)}
                                />
                            </div>
                        </div>
                        {errors.date ? (
                            <span className="field-error">{errors.date}</span>
                        ) : (
                            nights > 0 && (
                                <span className="nights-hint">
                                    {nights} {nights === 1 ? "night" : "nights"} · rate {formatINR(room.price)} / night
                                </span>
                            )
                        )}

                        <div className="booking-step">
                            <span className="step-num">03</span>
                            <div>
                                <h2>Guests & contact</h2>
                                <p>We'll call to confirm your arrival time.</p>
                            </div>
                        </div>
                        <div className="stepper-row">
                            <Stepper
                                label="Guests"
                                value={guests}
                                onChange={setGuests}
                                max={room.maxGuests}
                                hint={`This room fits up to ${room.maxGuests}`}
                            />
                            <Stepper
                                label="Rooms"
                                value={roomCount}
                                onChange={setRoomCount}
                                max={3}
                                hint="Book up to 3 rooms at once"
                            />
                        </div>
                        <div className="field-row">
                            <div className="form-field">
                                <label htmlFor="room-name">Your name</label>
                                <input
                                    id="room-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Amit Sharma"
                                    className={errors.name ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.name)}
                                />
                                {errors.name && <span className="field-error">{errors.name}</span>}
                            </div>
                            <div className="form-field">
                                <label htmlFor="room-phone">Phone number</label>
                                <input
                                    id="room-phone"
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
                            <label htmlFor="room-notes">Anything else? <span className="form-optional">(optional)</span></label>
                            <textarea
                                id="room-notes"
                                rows="3"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Early arrival, kids, accessibility needs..."
                            />
                        </div>
                    </div>

                    <aside className="booking-summary">
                        <span className="summary-kicker">YOUR STAY</span>
                        <h3>{room.name}</h3>
                        <p className="summary-sub">{room.tagline}</p>
                        <div className="summary-lines">
                            <div className="summary-line"><span>Check-in</span><b>{formatDate(checkIn)}</b></div>
                            <div className="summary-line"><span>Check-out</span><b>{formatDate(checkOut)}</b></div>
                            <div className="summary-line">
                                <span>Nights</span>
                                <b>{nights} {nights === 1 ? "night" : "nights"}</b>
                            </div>
                            <div className="summary-line">
                                <span>Guests · rooms</span>
                                <b>{guests} · {roomCount}</b>
                            </div>
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <b>{formatINR(subtotal)}</b>
                            </div>
                            <div className="summary-line">
                                <span>GST (12%)</span>
                                <b>{formatINR(gst)}</b>
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
                            <span>Free cancellation up to 48 hours before check-in.</span>
                        </div>
                        <ul className="summary-includes">
                            {room.perks.map((item) => (
                                <li key={item}><Check size={13} />{item}</li>
                            ))}
                        </ul>
                    </aside>
                </form>
            </section>
        </main>
    );
}
