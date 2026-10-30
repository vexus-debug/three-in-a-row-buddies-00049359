import { useState } from "react";
import { Boxes, FileText, Receipt, Wallet } from "lucide-react";

type Condition = "composite" | "crown" | "endo" | "extraction";

const CONDITIONS: Record<Condition, { label: string; swatch: string; soap: string; code: string; fee: string; stock: string; commission: string }> = {
  composite: { label: "Composite resin (MOD)", swatch: "fill-primary stroke-[hsl(var(--primary-text))]", soap: "Caries on mesial, occlusal and distal surfaces. Restored with A2 composite.", code: "Composite filling, 3 surfaces", fee: "₦45,000", stock: "−1 composite syringe A2, −1 bonding unit", commission: "₦13,500 to treating dentist" },
  crown: { label: "Porcelain crown", swatch: "fill-foreground stroke-foreground", soap: "Fractured incisal edge. Prepared for full-coverage porcelain crown, shade A1.", code: "Porcelain crown", fee: "₦180,000", stock: "−1 impression putty, lab slip sent", commission: "₦54,000 to treating dentist" },
  endo: { label: "Root canal treatment", swatch: "fill-[hsl(var(--status-warning))] stroke-[hsl(var(--status-warning))]", soap: "Irreversible pulpitis. Canals shaped, irrigated and obturated.", code: "Root canal, molar", fee: "₦120,000", stock: "−3 files, −1 gutta-percha pack, −2 anaesthetic cartridges", commission: "₦36,000 to treating dentist" },
  extraction: { label: "Surgical extraction", swatch: "fill-muted-foreground/40 stroke-muted-foreground", soap: "Impacted third molar. Surgical extraction scheduled, consent signed.", code: "Surgical extraction", fee: "₦75,000", stock: "−2 anaesthetic cartridges, −1 suture pack", commission: "₦22,500 to treating dentist" },
};

const preset: Record<number, Condition> = { 16: "composite", 21: "crown", 36: "endo", 48: "extraction" };
const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const Tooth = ({ n, active, cond, onClick }: { n: number; active: boolean; cond?: Condition; onClick: () => void }) => {
  const molar = [6, 7, 8].includes(n % 10);
  return (
    <button type="button" onClick={onClick} aria-pressed={active} aria-label={`Tooth ${n}${cond ? `, ${CONDITIONS[cond].label}` : ""}`}
      className={`flex min-w-0 flex-col items-center gap-1 rounded-md py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "bg-primary/20" : "hover:bg-muted"}`}>
      <svg viewBox="0 0 20 24" className="h-6 w-full max-w-[22px] sm:h-8">
        <rect x={molar ? 1.5 : 4} y="2" width={molar ? 17 : 12} height="20" rx="5"
          className={cond ? CONDITIONS[cond].swatch : "fill-foreground/85 stroke-foreground/40"} strokeWidth="1.2"
          strokeDasharray={cond === "extraction" ? "2 2" : undefined} />
      </svg>
      <span className={`text-[10px] tabular-nums ${active ? "text-foreground" : "text-muted-foreground"}`}>{n}</span>
    </button>
  );
};

export const DentalCockpit = () => {
  const [tooth, setTooth] = useState(16);
  const cond = preset[tooth] ?? "composite";
  const c = CONDITIONS[cond];
  const ledger = [
    { icon: FileText, t: "SOAP note drafted", d: c.soap },
    { icon: Receipt, t: "Added to the bill", d: `${c.code} · ${c.fee}` },
    { icon: Boxes, t: "Stock updated", d: c.stock },
    { icon: Wallet, t: "Commission calculated", d: c.commission },
  ];

  return (
    <section id="features" className="mb-16 scroll-mt-24 lg:mb-24">
      <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Tap a tooth. Watch the rest of the clinic keep up.</h2>
      <p className="mb-8 max-w-2xl text-muted-foreground">One entry in the chair updates the note, the bill, the stock and the dentist's pay. Try it — pick any marked tooth.</p>
      <div className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.25fr_1fr]">
        <div className="border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {(Object.keys(CONDITIONS) as Condition[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5"><rect width="10" height="10" rx="2" className={CONDITIONS[k].swatch} /></svg>{CONDITIONS[k].label}
              </span>
            ))}
          </div>
          <div className="rounded-xl bg-background p-2 sm:p-4">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
              {upper.map((n) => <Tooth key={n} n={n} active={tooth === n} cond={preset[n]} onClick={() => setTooth(n)} />)}
            </div>
            <div className="my-2 border-t border-dashed border-border" />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
              {lower.map((n) => <Tooth key={n} n={n} active={tooth === n} cond={preset[n]} onClick={() => setTooth(n)} />)}
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">FDI numbering. Unmarked teeth show a sample composite filling.</p>
        </div>
        <div className="p-4 sm:p-6" aria-live="polite">
          <p className="text-sm text-muted-foreground">Tooth {tooth}</p>
          <h3 className="mb-5 text-xl font-bold text-card-foreground">{c.label}</h3>
          <ol className="space-y-4">
            {ledger.map((l) => (
              <li key={l.t} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15"><l.icon className="h-4 w-4 text-primary" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-card-foreground">{l.t}</p>
                  <p className="text-sm leading-snug text-muted-foreground">{l.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
