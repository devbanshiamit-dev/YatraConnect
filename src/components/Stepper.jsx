import { Minus, Plus } from "lucide-react";
import { clamp } from "../lib/booking";

export default function Stepper({ label, value, onChange, min = 1, max = 10, hint }) {
  const set = (next) => onChange(clamp(next, min, max));

  return (
    <div className="stepper-field">
      <span className="form-label">{label}</span>
      <div className="stepper">
        <button
          type="button"
          onClick={() => set(value - 1)}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="stepper-value">{value}</span>
        <button
          type="button"
          onClick={() => set(value + 1)}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
      {hint && <small className="stepper-hint">{hint}</small>}
    </div>
  );
}
