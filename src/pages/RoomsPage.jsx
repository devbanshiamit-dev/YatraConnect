import { useRef, useState } from "react";
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
    isValidPhone,
} from "../lib/booking";
import Stepper from "../components/Stepper";
import BookingSuccess from "../components/BookingSuccess";

const BOOKING_WINDOW_DAYS = 90;

export default function RoomsPage() {
    const [params] = useSearchParams();
    const today = todayISO();

    const initialRoom = rooms.find((r) => r.id === params.get("room")) ?? rooms[0];
    const paramDate = params.get("date");
    const paramGuests = Number(params.get("guests"));

    const initialCheckIn =
        isValidISODate(paramDate) && paramDate >= today && paramDate <= addDaysISO(today, BOOKING_WINDOW_DAYS - 1)
            ? paramDate
            : addDaysISO(today, 1);

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
    const submitLock = useRef(false);

    const room = rooms.find((r) => r.id === roomId);

    const datesValid = isValidISODate(checkIn) && isValidISODate(checkOut);
    const nights = datesValid ? Math.max(0, nightsBetween(checkIn, checkOut)) : 0;
    const guestCapacity = room.maxGuests * roomCount;
    const subtotal = room.price * nights * roomCount;
    const gst = Math.round(subtotal * GST_RATE);
    const total = subtotal + gst;

    const selectRoom = (next) => {
        setRoomId(next.id);
        setGuests((g) => clamp(g, 1, next.maxGuests * roomCount));
        setErrors((current) => ({ ...current, guests: undefined, storage: undefined }));
    };

    const updateCheckIn = (value) => {
        const stay = datesValid && nightsBetween(checkIn, checkOut) > 0
            ? nightsBetween(checkIn, checkOut)
            : 2;
        setCheckIn(value);
        if (!isValidISODate(checkOut) || (isValidISODate(value) && checkOut <= value)) {
            const latestCheckOut = addDaysISO(today, BOOKING_WINDOW_DAYS);
            const desiredCheckOut = isValidISODate(value) ? addDaysISO(value, Math.max(1, stay)) : "";
            setCheckOut(isValidISODate(value) && desiredCheckOut > latestCheckOut ? latestCheckOut : desiredCheckOut);
        }
        setErrors((current) => ({ ...current, checkIn: undefined, checkOut: undefined, storage: undefined }));
    };

    const updateRoomCount = (value) => {
        setRoomCount(value);
        setGuests((current) => clamp(current, 1, room.maxGuests * value));
        setErrors((current) => ({ ...current, guests: undefined, rooms: undefined, storage: undefined }));
    };

    const updateGuests = (value) => {
        setGuests(value);
        setErrors((current) => ({ ...current, guests: undefined, storage: undefined }));
    };

    const submit = (e) => {
        e.preventDefault();
        const next = {};
        if (!isValidISODate(checkIn) || checkIn < today || checkIn > addDaysISO(today, BOOKING_WINDOW_DAYS)) next.checkIn = "Choose a valid check-in within the next 90 days.";
        if (!isValidISODate(checkOut) || !isValidISODate(checkIn) || checkOut <= checkIn || checkOut > addDaysISO(today, BOOKING_WINDOW_DAYS)) next.checkOut = "Choose a check-out after check-in and within the 90-day booking window.";
        if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 3) next.rooms = "Choose between 1 and 3 rooms.";
        if (!Number.isInteger(guests) || guests < 1 || guests > guestCapacity) next.guests = `Choose 1 to ${guestCapacity} guests for ${roomCount} room${roomCount === 1 ? "" : "s"}.`;
        if (!name.trim() || name.trim().length > 100) next.name = "Enter your name (up to 100 characters).";
        if (!isValidPhone(phone)) next.phone = "Enter a valid phone number with 7 to 15 digits.";
        setErrors(next);
        if (Object.keys(next).length) return;
        if (submitLock.current) return;
        submitLock.current = true;

        const result = storeRecord({
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
            });
        if (result.success) setConfirmed(result.record);
        else {
            submitLock.current = false;
            setErrors({ storage: "We couldn't save this request on this device. Check browser storage and try again." });
        }
    };

    if (confirmed) {
        return (
            <main className="booking-page">
                <section className="booking-section container">
                    <BookingSuccess
                        reference={confirmed.reference}
                        title="Your stay request is saved."
                        note="This request is saved locally. Room availability and supplier confirmation are not connected yet."
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
                        onReset={() => { submitLock.current = false; setConfirmed(null); }}
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
                        Explore stays near the ghats with breakfast included. Requests are saved locally; availability is not connected yet.
                    </p>
                    <div className="page-hero-meta">
                        <span><ShieldCheck size={15} />Prototype request only</span>
                        <span><BedDouble size={15} />Breakfast included</span>
                        <span><Clock3 size={15} />Availability needs confirmation</span>
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
                                    max={addDaysISO(today, BOOKING_WINDOW_DAYS - 1)}
                                    value={checkIn}
                                    onChange={(e) => updateCheckIn(e.target.value)}
                                    className={errors.checkIn ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.checkIn)}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="room-checkout">Check-out</label>
                                <input
                                    id="room-checkout"
                                    type="date"
                                    min={addDaysISO(checkIn, 1)}
                                    max={addDaysISO(today, BOOKING_WINDOW_DAYS)}
                                    value={checkOut}
                                    onChange={(e) => { setCheckOut(e.target.value); setErrors((v) => ({ ...v, checkOut: undefined, storage: undefined })); }}
                                    className={errors.checkOut ? "invalid" : ""}
                                    aria-invalid={Boolean(errors.checkOut)}
                                />
                            </div>
                        </div>
                        {errors.checkIn || errors.checkOut ? (
                            <span className="field-error" role="alert">{errors.checkIn || errors.checkOut}</span>
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
                                <p>Room requests are not sent to a supplier.</p>
                            </div>
                        </div>
                        <div className="stepper-row">
                            <Stepper
                                label="Guests"
                                value={guests}
                                onChange={updateGuests}
                                max={guestCapacity}
                                hint={`${room.maxGuests} guests per room; ${guestCapacity} across ${roomCount} room${roomCount === 1 ? "" : "s"}`}
                            />
                            <Stepper
                                label="Rooms"
                                value={roomCount}
                                onChange={updateRoomCount}
                                max={3}
                                hint="Book up to 3 rooms at once"
                            />
                        </div>
                        {errors.guests && <span className="field-error" role="alert">{errors.guests}</span>}
                        {errors.rooms && <span className="field-error" role="alert">{errors.rooms}</span>}
                        <div className="field-row">
                            <div className="form-field">
                                <label htmlFor="room-name">Your name</label>
                                <input
                                    id="room-name"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setErrors((v) => ({ ...v, name: undefined, storage: undefined })); }}
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
                                    type="tel"
                                    autoComplete="tel"
                                    onChange={(e) => { setPhone(e.target.value); setErrors((v) => ({ ...v, phone: undefined, storage: undefined })); }}
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
                                <span>Estimated GST (12%*)</span>
                                <b>{formatINR(gst)}</b>
                            </div>
                        </div>
                        <small className="form-footnote">*12% is a configurable prototype estimate; verify the applicable rate before production.</small>
                        <div className="summary-total">
                            <span>Total</span>
                            <b>{formatINR(total)}</b>
                        </div>
                        {errors.storage && <p className="field-error" role="alert">{errors.storage}</p>}
                        <button className="button button-accent summary-confirm" type="submit">
                            Save stay request
                        </button>
                        <div className="summary-note">
                            <Clock3 size={14} />
                            <span>Saved locally on this device only.</span>
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
