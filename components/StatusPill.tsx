export default function StatusPill({ value }: { value: string }) { return <span className={`status ${value}`}>{value}</span>; }
