import { Github, Linkedin, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo.jsx";

const SOCIALS = [
  { label: "GitHub", icon: Github, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer id="faq" className="bg-navy-900 px-6 py-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <div className="flex gap-4 text-white/90">
          {SOCIALS.map(({ label, icon: Icon, href }) => (
            <a key={label} href={href} aria-label={label} className="hover:text-white">
              <Icon size={18} />
            </a>
          ))}
        </div>
        <div className="flex gap-6 text-xs">
          <a href="#">Contact</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#" className="text-brand-100">Part of UM6P</a>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-[11px] text-white/70">
        <span>© 2025 1337. All rights reserved.</span>
        <span className="font-semibold text-white">Build. Share. Grow.</span>
      </div>
    </footer>
  );
}
