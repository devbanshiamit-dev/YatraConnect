export default function SectionTitle({kicker,title}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        <span className="eyebrow-line"/>{kicker}</span>
        <h2>{title}</h2>
    </div>
  );
}