import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BlackHolePortrait from "@/components/BlackHolePortrait";
import {
  Menu, X, Github, Linkedin, Mail, Phone, MapPin, ArrowRight, ArrowUp,
  Code2, Database, Cpu, Wrench, Sparkles, Users, ExternalLink, Send,
  Globe, Bot, Plug, ChevronDown,
} from "lucide-react";
const profileImg = "https://i.postimg.cc/JnnkjD7n/Whats-App-Image-2026-03-27-at-6-35-47-PM.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sribalaji I — Full Stack Developer Portfolio" },
      { name: "description", content: "Portfolio of Sribalaji I, a Full Stack Developer building scalable, user-centric solutions with AI and modern web technologies." },
      { name: "author", content: "Sribalaji I" },
    ],
  }),
});

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const TYPING = ["Full Stack Developer", "AI/ML Enthusiast", "Python Developer"];

function useTyping(words: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = words[i % words.length];
    const speed = del ? 50 : 90;
    const t = setTimeout(() => {
      const next = del ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1);
      setText(next);
      if (!del && next === current) setTimeout(() => setDel(true), 1400);
      else if (del && next === "") { setDel(false); setI(i + 1); }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

function Index() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const typed = useTyping(TYPING);

  useEffect(() => {
    document.body.classList.add("portfolio");
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => { document.body.classList.remove("portfolio"); window.removeEventListener("scroll", onScroll); };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      {/* Background blobs */}
      <div className="pf-blob anim" style={{ width: 400, height: 400, top: -100, right: -80, background: "#2a7fff" }} />
      <div className="pf-blob anim" style={{ width: 500, height: 500, top: 600, left: -150, background: "#00e0ff", animationDelay: "3s" }} />
      <div className="pf-blob anim" style={{ width: 350, height: 350, top: 1500, right: 100, background: "#2a7fff", animationDelay: "6s" }} />

      {/* NAV */}
      <header className="pf-glass fixed top-0 inset-x-0 z-50">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button onClick={() => go("home")} className="font-bold text-lg tracking-tight">
            <span className="pf-gradient-text">Sribalaji</span>
            <span className="text-white">.dev</span>
          </button>
          <ul className="hidden md:flex items-center gap-7 text-sm text-[var(--pf-muted)]">
            {NAV.map(n => (
              <li key={n.id}>
                <button onClick={() => go(n.id)} className="hover:text-white transition-colors">{n.label}</button>
              </li>
            ))}
          </ul>
          <button onClick={() => go("contact")} className="hidden md:inline-flex pf-btn-primary text-sm !py-2 !px-4">Hire Me</button>
          <button aria-label="Toggle menu" className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        {open && (
          <div className="md:hidden border-t border-white/10 bg-[#0a0f1f]/95">
            <ul className="px-6 py-4 flex flex-col gap-3">
              {NAV.map(n => (
                <li key={n.id}><button onClick={() => go(n.id)} className="w-full text-left py-2 text-[var(--pf-muted)] hover:text-white">{n.label}</button></li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <main className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-24">
        {/* HERO */}
        <section id="home" className="min-h-[88vh] grid lg:grid-cols-2 gap-10 items-center py-12">
          <div>
            <span className="pf-chip"><Sparkles size={14} /> Available for new projects</span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Hi, I'm <span className="pf-gradient-text whitespace-nowrap">Sribalaji&nbsp;I</span>
            </h1>
            <p className="mt-4 text-xl sm:text-2xl text-[var(--pf-muted)] font-medium">
              {typed}
              <span className="pf-caret" style={{ height: "1.1em", verticalAlign: "-2px" }} />
            </p>
            <p className="mt-5 max-w-xl text-[var(--pf-muted)] leading-relaxed">
              Building scalable, user-centric solutions with AI &amp; modern web technologies.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => go("projects")} className="pf-btn-primary inline-flex items-center gap-2">
                View Projects <ArrowRight size={18} />
              </button>
              <button onClick={() => go("contact")} className="pf-btn-ghost inline-flex items-center gap-2">
                Contact Me <Mail size={18} />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <a aria-label="GitHub" href="https://github.com/sribalajji" target="_blank" rel="noreferrer" className="pf-glass w-11 h-11 rounded-full flex items-center justify-center hover:text-[var(--pf-cyan)] transition"><Github size={18} /></a>
              <a aria-label="LinkedIn" href="https://linkedin.com/in/sribalajj-i" target="_blank" rel="noreferrer" className="pf-glass w-11 h-11 rounded-full flex items-center justify-center hover:text-[var(--pf-cyan)] transition"><Linkedin size={18} /></a>
              <a aria-label="Email" href="mailto:isribalajj335@gmail.com" className="pf-glass w-11 h-11 rounded-full flex items-center justify-center hover:text-[var(--pf-cyan)] transition"><Mail size={18} /></a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,224,255,0.35)]">
              <BlackHolePortrait src={profileImg} className="absolute inset-0 w-full h-full" />
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-center mt-4">
            <button onClick={() => go("about")} aria-label="Scroll down" className="text-[var(--pf-muted)] animate-bounce">
              <ChevronDown />
            </button>
          </div>
        </section>

        {/* ABOUT */}
        <Section id="about" eyebrow="About Me" title="A developer who ships ideas end-to-end">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="pf-card p-6 lg:col-span-2">
              <p className="text-[var(--pf-muted)] leading-relaxed">
                Motivated Full Stack Developer with hands-on experience in Python, HTML, CSS, JavaScript, and SQL.
                Proven ability to build and deploy end-to-end applications including an AI-powered movie
                recommendation engine with 600+ curated entries and cross-platform support. Strong foundation in
                web development, APIs, Git version control, and integrating AI/ML components. Currently enhancing
                skills through professional training at <span className="text-white font-medium">Q-Spiders, Coimbatore</span>.
              </p>
              <h3 className="mt-6 font-semibold text-white">Education</h3>
              <ul className="mt-3 space-y-3 text-sm text-[var(--pf-muted)]">
                <li className="pf-glass rounded-xl p-4">
                  <div className="text-white font-medium">Professional Training — QSpiders, Coimbatore</div>
                  <div className="text-xs mt-1">2026 – Present · Python, SQL, Web Development, industry-level coding practices.</div>
                </li>
                <li className="pf-glass rounded-xl p-4">
                  <div className="text-white font-medium">Bachelor's Degree at Electronics and Communication Engineering</div>
                  <div className="text-xs mt-1">​Park College Of Engineering And Technology - 2026</div>
                </li>
              </ul>
            </div>
            <div className="pf-card p-6">
              <h3 className="font-semibold text-white flex items-center gap-2"><Users size={18} className="text-[var(--pf-cyan)]" /> Leadership</h3>
              <ul className="mt-4 space-y-4 text-sm text-[var(--pf-muted)]">
                <li>
                  <div className="text-white font-medium">Chief Executive</div>
                  <div className="text-xs">Higher Helper Education Company · 2022–23</div>
                  <p className="mt-1">Led FDPs and cross-functional teams across initiatives.</p>
                </li>
                <li>
                  <div className="text-white font-medium">MOC Lead — College-Level FDP</div>
                  <p className="mt-1 text-xs">Mentored a 4-member project team with agile tracking.</p>
                </li>
                <li>
                  <div className="text-white font-medium">Technical Communication</div>
                  <p className="mt-1 text-xs">Regularly delivered technical demos and documentation.</p>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" eyebrow="My Stack" title="Skills & Technologies">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkillCard icon={<Code2 />} title="Frontend" items={["HTML5", "CSS3", "JavaScript (Basic)", "Responsive UI Design"]} />
            <SkillCard icon={<Cpu />} title="Backend" items={["Python", "REST API Integration", "Automation"]} />
            <SkillCard icon={<Database />} title="Database" items={["Oracle SQL", "SQLite"]} />
            <SkillCard icon={<Wrench />} title="Tools & Platforms" items={["Git", "GitHub", "VS Code", "Twilio API", "yagmail"]} />
            <SkillCard icon={<Sparkles />} title="AI / ML Libraries" items={["OpenCV", "YOLOv8", "NumPy", "LLM Prompting", "Generative AI"]} />
            <SkillCard icon={<Users />} title="Soft Skills" items={["Technical Documentation", "Cross-Team Collaboration", "Agile Project Tracking"]} />
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" eyebrow="My Work" title="Featured Projects">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="FEELM"
              subtitle="AI-Powered Movie Recommendation Web App"
              date="Mar 2025 – Present"
              tech={["Python", "HTML", "CSS", "JavaScript", "AI", "SQLite"]}
              desc="Full-stack app that recommends movies based on emotional state (6+ moods, 600+ movies). Features multilingual support (English & Tamil), Eating Mode, Surprise Me!, cross-platform (web/desktop) and offline access."
            />
            <ProjectCard
              title="Smart CCTV"
              subtitle="AI-Integrated Surveillance System"
              date="Jan 2025 – May 2025"
              tech={["Python", "OpenCV", "YOLOv8", "SQLite", "Twilio", "yagmail"]}
              desc="Python backend with face recognition, real-time attendance logging, fire/smoke detection, pose estimation for suspicious activity, and automated SMS/email alerts with false-trigger reduction."
            />
            <ProjectCard
              title="Jarvis"
              subtitle="Personal AI Voice Assistant"
              date="Apr 2025 – Present"
              tech={["Python", "LLM Prompting", "Automation", "GenAI"]}
              desc="Voice-activated assistant with context memory, natural conversation, and productivity utilities like resume formatting and tech tools."
            />
          </div>
        </Section>

        {/* SERVICES */}
        <Section id="services" eyebrow="What I Do" title="Services I Offer">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <ServiceCard icon={<Globe />} title="Full Stack Web Development" desc="Responsive websites with end-to-end frontend & backend integration." />
            <ServiceCard icon={<Bot />} title="AI/ML Integration" desc="Recommendation engines, computer vision and LLM-based assistants." />
            <ServiceCard icon={<Plug />} title="API & Automation" desc="REST APIs, email/SMS alert pipelines and workflow automation." />
            <ServiceCard icon={<Database />} title="Database Design" desc="SQL (Oracle, SQLite), schema modeling and query optimization." />
          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" eyebrow="Get in Touch" title="Let's build something together">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="pf-card p-6 space-y-4">
              <ContactRow icon={<Phone />} label="Phone" value="+919585144178" href="tel:+919585144178" />
              <ContactRow icon={<Mail />} label="Email" value="isribalajj335@gmail.com" href="mailto:isribalajj335@gmail.com" />
              <ContactRow icon={<Github />} label="GitHub" value="github.com/sribalajji" href="https://github.com/sribalajji" />
              <ContactRow icon={<Linkedin />} label="LinkedIn" value="linkedin.com/in/sribalajj-i" href="https://linkedin.com/in/sribalajj-i" />
              <ContactRow icon={<MapPin />} label="Location" value="Coimbatore, India" />
            </div>
            <form
              className="pf-card p-6 space-y-4"
              onSubmit={(e) => { e.preventDefault(); alert("Thanks! Hook this form up to Formspree or EmailJS."); }}
            >
              <Field label="Name"><input required type="text" className="pf-input" placeholder="Your name" /></Field>
              <Field label="Email"><input required type="email" className="pf-input" placeholder="you@example.com" /></Field>
              <Field label="Message"><textarea required rows={5} className="pf-input resize-none" placeholder="Tell me about your project..." /></Field>
              <button type="submit" className="pf-btn-primary inline-flex items-center gap-2 w-full justify-center">
                Send Message <Send size={16} />
              </button>
            </form>
          </div>
        </Section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--pf-muted)]">
          <p><span className="text-white">SriBalaji.i</span></p>
          <div className="flex items-center gap-5">
            {NAV.map(n => (
              <button key={n.id} onClick={() => go(n.id)} className="hover:text-white transition">{n.label}</button>
            ))}
          </div>
        </div>
      </footer>

      {showTop && (
        <button
          aria-label="Back to top"
          onClick={() => go("home")}
          className="fixed bottom-6 right-6 z-50 pf-btn-primary !p-3 rounded-full shadow-lg"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <style>{`
        .pf-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--pf-border);
          border-radius: 12px;
          padding: 12px 14px;
          color: var(--pf-text);
          outline: none;
          transition: border-color .2s ease, box-shadow .2s ease;
        }
        .pf-input::placeholder { color: #5d6c89; }
        .pf-input:focus { border-color: var(--pf-cyan); box-shadow: 0 0 0 3px rgba(0,224,255,0.15); }
      `}</style>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 scroll-mt-20">
      <div className="mb-10 text-center">
        <span className="pf-chip">{eyebrow}</span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          <span className="pf-gradient-text">{title}</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

function SkillCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="pf-card p-6">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[var(--pf-cyan)] bg-[rgba(0,224,255,0.08)] border border-[rgba(0,224,255,0.2)]">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map(i => <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--pf-muted)]">{i}</span>)}
      </div>
    </div>
  );
}

function ProjectCard({ title, subtitle, date, tech, desc }: { title: string; subtitle: string; date: string; tech: string[]; desc: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="pf-card p-6 flex flex-col">
      <div className="text-xs text-[var(--pf-cyan)]">{date}</div>
      <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-[var(--pf-muted)]">{subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tech.map(t => <span key={t} className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--pf-muted)]">{t}</span>)}
      </div>
      <p className={`mt-4 text-sm text-[var(--pf-muted)] leading-relaxed ${open ? "" : "line-clamp-3"}`}>{desc}</p>
      <button onClick={() => setOpen(!open)} className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--pf-cyan)] hover:underline self-start">
        {open ? "Show less" : "Learn more"} <ExternalLink size={14} />
      </button>
    </article>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="pf-card p-6">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[var(--pf-cyan)] bg-[rgba(0,224,255,0.08)] border border-[rgba(0,224,255,0.2)]">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-[var(--pf-muted)] leading-relaxed">{desc}</p>
    </div>
  );
}

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const Inner = (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[var(--pf-cyan)] bg-[rgba(0,224,255,0.08)] border border-[rgba(0,224,255,0.2)]">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-[var(--pf-muted)]">{label}</div>
        <div className="text-white text-sm">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className="block hover:translate-x-1 transition-transform">{Inner}</a> : Inner;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-[var(--pf-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
