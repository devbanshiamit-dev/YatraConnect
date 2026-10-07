import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function BookingSuccess({ reference, title, note, lines, total, resetLabel, onReset }) {
  return (
    <div className="success-card">
      <span className="success-icon">
        <Check size={26} />
      </span>
      <h2>{title}</h2>
      <p className="success-sub">{note}</p>
      <span className="success-ref">{reference}</span>
      <div className="success-lines">
        {lines.map(([label, value]) => (
          <div className="summary-line" key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      {total && (
        <div className="success-total">
          <span>Total</span>
          <b>{total}</b>
        </div>
      )}
      <div className="success-actions">
        <button type="button" className="button button-dark" onClick={onReset}>
          {resetLabel}
        </button>
        <Link className="text-link" to="/">
          Back to home<span>↗</span>
        </Link>
      </div>
    </div>
  );
}
