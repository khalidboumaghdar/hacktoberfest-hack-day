import { Link } from "react-router-dom";
import {
  MessageCircle, ArrowRight, Code2, Users, BrainCircuit, Star,
  Check, Lightbulb, GraduationCap, BookOpen, CalendarDays, HelpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import schoolImage from "../assets/images/1337_cum.png";
import Studentimg from "../assets/images/students_learning_reference.png"

const FEATURES = [
  { icon: Code2, title: "Project-Based Learning", text: "Learn by building real projects from day one." },
  { icon: Users, title: "Peer-to-Peer", text: "Share knowledge, help each other, grow together." },
  { icon: BrainCircuit, title: "Open Source & Innovation", text: "Work with modern technologies and open-source tools." },
  { icon: Star, title: "Part of UM6P", text: "A world-class university ecosystem in Morocco." },
];

const UNIQUE = [
  "A hands-on, project-based curriculum",
  "No traditional teachers — learn from your peers",
  "A strong focus on teamwork and collaboration",
  "Access to cutting-edge technologies",
  "A supportive and inclusive community",
];

const EXPLORE = [
  { icon: GraduationCap, title: "Admissions", text: "How to apply, requirements, important dates..." },
  { icon: BookOpen, title: "Curriculum", text: "Programming, projects, technologies..." },
  { icon: CalendarDays, title: "Campus Life", text: "Events, clubs, housing, facilities..." },
  { icon: HelpCircle, title: "FAQ", text: "Common questions and answers." },
];

function IconBox({ icon: Icon }) {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand">
      <Icon size={22} />
    </span>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl p-3 sm:p-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-slate-300/50">
        {/* ---------- Navbar + Hero ---------- */}
        <header className="relative bg-navy-950 text-white">
          <img
            src={schoolImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent" />

          <Navbar />

          <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-20">
            <p className="text-xs font-semibold tracking-widest text-brand-100">WELCOME TO 1337</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
              Learn Today.
              <br />
              <span className="text-brand">Build</span> Tomorrow.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85">
              1337 is a coding school in Morocco, part of the UM6P ecosystem. We offer a unique, hands-on
              learning experience based on peer-to-peer collaboration, project-based learning and
              real-world skills.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#learning" className="flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold hover:bg-brand-dark">
                Explore 1337 <ArrowRight size={16} />
              </a>
              <Link to="/chat" className="flex items-center gap-2 rounded-md border border-white/70 px-5 py-3 text-sm font-semibold hover:bg-white/10">
                <MessageCircle size={16} /> Ask the AI Assistant
              </Link>
            </div>
          </div>
        </header>

        {/* ---------- Features strip ---------- */}
        <section id="about" className="grid gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
          {FEATURES.map((f) => (
            <div key={f.title} className="lg:px-5 lg:first:pl-0">
              <IconBox icon={f.icon} />
              <h3 className="mt-4 text-sm font-bold">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{f.text}</p>
            </div>
          ))}
        </section>

        {/* ---------- What makes 1337 unique ---------- */}
        <section id="learning" className="bg-brand-50/60 px-6 py-10">
          <h2 className="text-xl font-bold">What Makes 1337 Unique?</h2>
          <div className="mt-5 grid items-center gap-8 md:grid-cols-2">
            <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-navy-800 to-brand">
              <img
                src= {Studentimg}
                alt="Students coding together at 1337"
                className="h-full w-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <ul className="space-y-4">
              {UNIQUE.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-brand-100 bg-brand-100/60 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-brand">
                <Lightbulb size={24} />
              </span>
              <div>
                <h3 className="font-bold">Curious about 1337?</h3>
                <p className="text-xs text-muted">
                  Ask our AI assistant for more information about admissions, the learning method,
                  projects, campus life and more.
                </p>
              </div>
            </div>
            <Link to="/chat" className="flex shrink-0 items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              <MessageCircle size={16} /> Open Chat
            </Link>
          </div>
        </section>

        {/* ---------- Explore ---------- */}
        <section id="campus-life" className="px-6 py-10">
          <h2 className="text-xl font-bold">Explore 1337</h2>
          <p className="mt-1 text-sm text-muted">Find the information you need</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE.map((c) => (
              <Link
                key={c.title}
                to="/chat"
                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-md"
              >
                <IconBox icon={c.icon} />
                <h3 className="mt-3 text-sm font-bold">{c.title}</h3>
                <p className="mt-1 text-xs text-muted">{c.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Learn more <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
