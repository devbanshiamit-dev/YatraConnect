import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Hotel, Ship, Users } from "lucide-react";
import { addDaysISO, clamp, isValidISODate, todayISO } from "../lib/booking";

export default function QuickSearch() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("boats");
  const [date, setDate] = useState(todayISO);
  const [guests, setGuests] = useState(2);
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!isValidISODate(date) || date < todayISO() || date > addDaysISO(todayISO(), 90)) {
      setError("Choose a date within the next 90 days.");
      return;
    }
    if (!Number.isInteger(Number(guests)) || guests < 1 || guests > 8) {
      setError("Choose between 1 and 8 guests.");
      return;
    }
    setError("");
    const query = `?date=${date}&guests=${guests}`;
    navigate(tab === "boats" ? `/boats${query}` : `/rooms${query}`);
  };

  return (
    <form className="quick-search" onSubmit={submit}>
      <div className="qs-tabs" role="tablist" aria-label="What are you booking?">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "boats"}
          className={`qs-tab ${tab === "boats" ? "active" : ""}`}
          onClick={() => setTab("boats")}
        >
          <Ship size={14} /> Boat rides
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "rooms"}
          className={`qs-tab ${tab === "rooms" ? "active" : ""}`}
          onClick={() => setTab("rooms")}
        >
          <Hotel size={14} /> Stays
        </button>
      </div>
      <div className="qs-row">
        <label className="qs-field">
          <CalendarDays size={14} />
          <input
            type="date"
            value={date}
            min={todayISO()}
            max={addDaysISO(todayISO(), 90)}
            onChange={(event) => { setDate(event.target.value); setError(""); }}
            aria-label={tab === "boats" ? "Ride date" : "Check-in date"}
          />
        </label>
        <label className="qs-field qs-guests">
          <Users size={14} />
          <input
            type="number"
            min={1}
            max={8}
            value={guests}
            onChange={(event) => { setGuests(event.target.value === "" ? "" : clamp(Number(event.target.value), 1, 8)); setError(""); }}
            aria-label="Guests"
          />
        </label>
        <button className="button button-dark button-small" type="submit">
          Check <ArrowRight size={15} />
        </button>
      </div>
      {error && <span className="field-error" role="alert">{error}</span>}
    </form>
  );
}
