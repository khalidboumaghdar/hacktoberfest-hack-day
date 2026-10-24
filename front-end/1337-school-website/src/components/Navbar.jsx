import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Logo from "./Logo.jsx";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Learning", href: "#learning" },
  { label: "Campus Life", href: "#campus-life" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between bg-navy-900/95 px-5 py-3">
      <Link to="/"><Logo /></Link>

      <ul className="hidden gap-7 text-sm md:flex">
        {LINKS.map((l, i) => (
          <li key={l.label}>
            <a
              href={l.href}
              className={`pb-1 hover:text-white ${i === 0 ? "border-b-2 border-brand text-white" : "text-white/75"}`}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <Link
        to="/chat"
        className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <MessageCircle size={16} /> Open Chat
      </Link>
    </nav>
  );
}
