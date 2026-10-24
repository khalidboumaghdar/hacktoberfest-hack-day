import { FileText, ArrowRight } from "lucide-react";

export default function SourceCard({ title, page, url }) {
  return (
    <div className="mt-2 flex items-start gap-3 rounded-lg bg-white p-3">
      <FileText className="mt-0.5 text-brand" size={22} />
      <div className="text-xs">
        <p className="font-semibold">{title}</p>
        {page && <p className="text-muted">Page {page} · UM6P</p>}
        <a href={url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-brand">
          View source <ArrowRight size={11} />
        </a>
      </div>
    </div>
  );
}
