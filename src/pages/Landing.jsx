import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import WaveCanvas from '../components/WaveCanvas';
import CustomCursor from '../components/CustomCursor';

const ABOUT = [
  'Henix Type was developed by an 18-year-old developer who wanted to help others improve their typing skills, especially other developers and, above all, IT students.',
  'It was built on November 24, 2026, on a random, boring day.',
  'The owner is not that good at typing either, so he asked himself: why not build a typing application that helps him and everyone else?',
];

const CREDITS = [
  ['Built on', 'November 24, 2026'],
  ['Built by', 'An 18-year-old developer'],
  ['Built for', 'Developers and IT students'],
];

const GOALS = [
  'To help people improve their typing skills and typing style, especially IT students.',
  'To attract many developers to Henix Type through a leaderboard that shows which IT student types the best.',
  'To create opportunities for others. Henix Type is not only about improving typing skills; it also wants to give people the chance to become one of its developers.',
  'To become popular and reach one million users.',
];

const OWNER = [
  'I am an IT student in Calapan City, Oriental Mindoro, Philippines.',
  'I am 18 years old, and I want to create value and opportunity and help others.',
  'I like building and creating something new.',
  'I have many projects, but I cannot finish all of them because of limited resources.',
  'I built this application on November 24, 2026, on a random, boring day.',
];

const CONTACTS = [
  { name: 'Jhon Vincent Vitto', phone: '09128842378', mail: 'vittovincent26@gmail.com' },
  { name: 'Henix Type', phone: '09128842378', mail: 'Henixtype11@gmail.com' },
];

const SOCIALS = [
  ['Facebook', 'Henixtype', 'https://facebook.com/Henixtype'],
  ['Instagram', 'HenixType', 'https://instagram.com/HenixType'],
  ['GitHub', 'HenixType', 'https://github.com/HenixType'],
  ['TikTok', 'HenixType', 'https://tiktok.com/@HenixType'],
  ['Gmail', 'Henixtype11@gmail.com', 'mailto:Henixtype11@gmail.com'],
  ['Phone', '09128842378', 'tel:09128842378'],
];

const NAV = [
  ['Home', 'top'],
  ['About', 'about'],
  ['Goals', 'goals'],
  ['Owner', 'owner'],
  ['Contact / Feedback', 'contact'],
];

const calm = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  document.documentElement.classList.contains('reduced-motion');

function Section({ id, title, children }) {
  return (
    <section className="hx-sec" id={`hx-${id}`}>
      <h2>{title}</h2>
      <div className="hx-body">{children}</div>
    </section>
  );
}

export default function Landing({ onStart }) {
  const root = useRef(null);
  const body = useRef(null);

  const go = (id) => {
    if (id === 'top') root.current.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(`hx-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // The feedback form opens the visitor's email app with the message filled in.
  const send = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const text = `Name: ${d.get('name')}\nGmail: ${d.get('email')}\n\n${d.get('msg')}`;
    window.location.href = `mailto:Henixtype11@gmail.com?subject=${encodeURIComponent('Henix Type feedback')}&body=${encodeURIComponent(text)}`;
  };

  const bar = useRef(null);
  const startBtn = useRef(null);
  const timers = useRef([]);
  const [dlg, setDlg] = useState(null); // null | 'open' | 'closing'
  const [leaving, setLeaving] = useState(false);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, calm() ? 0 : ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Each block fades in as it scrolls into view.
  useLayoutEffect(() => {
    if (calm()) return undefined;
    const sel = '.hx-sec > h2, .hx-body > p, .hx-credits > div, .hx-goals li, .hx-list li, .hx-cards > *, .hx-form > *, .hx-socials li, .hx-foot > *';
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { root: root.current, threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    root.current.querySelectorAll(sel).forEach((el) => {
      el.classList.add('hx-rv');
      el.style.setProperty('--d', `${Math.min(4, [...el.parentElement.children].indexOf(el)) * 90}ms`);
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const onScroll = () => {
    const r = root.current;
    bar.current.style.transform = `scaleX(${r.scrollTop / Math.max(1, r.scrollHeight - r.clientHeight)})`;
  };

  const closeDlg = (after) => {
    if (dlg === 'closing') return;
    setDlg('closing');
    later(() => {
      setDlg(null);
      if (after) after();
    }, 220);
  };
  const cancel = () => closeDlg(() => startBtn.current?.focus());
  const learnMore = () => closeDlg(() => go('about'));
  const proceed = () => {
    closeDlg();
    setLeaving(true);
    later(onStart, 560);
  };
  const onDlgKey = (e) => {
    if (e.key === 'Escape') cancel();
    if (e.key !== 'Tab') return;
    const b = e.currentTarget.querySelectorAll('button');
    const first = b[0];
    const last = b[b.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={`hx${dlg ? ' hx--lock' : ''}${leaving ? ' hx--leaving' : ''}`} ref={root} onScroll={onScroll}>
      <div className="hx-progress" aria-hidden="true"><i ref={bar} /></div>
      <header className="hx-hero">
        <WaveCanvas focusRef={body} />
        <div className="hx-hero-body" ref={body}>
          <h1 className="hx-title" aria-label="Henix Type">
            {[...'Henix Type'].map((c, i) => (
              <span key={i} aria-hidden="true" style={{ '--i': i }}>
                {c === ' ' ? '\u00A0' : c}
              </span>
            ))}
          </h1>
          <p className="hx-tag">A typing application that helps you improve your typing skills, on computer or mobile.</p>
          <p className="hx-sub">Let’s improve your typing skills and become part of us.</p>
          <div className="hx-actions">
            <button type="button" ref={startBtn} className="hx-btn hx-btn--solid" onClick={() => setDlg('open')}>Start</button>
            <button type="button" className="hx-btn" onClick={() => go('about')}>About</button>
          </div>
        </div>
        <span className="hx-cue" aria-hidden="true" />
      </header>

      <main>
        <Section id="about" title="About Henix Type">
          <p className="hx-lead">{ABOUT[0]}</p>
          <p>{ABOUT[1]}</p>
          <p>{ABOUT[2]}</p>
          <dl className="hx-credits">
            {CREDITS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="goals" title="Henix Type Goals">
          <ol className="hx-goals">
            {GOALS.map((text, i) => (
              <li key={text}>
                <span className="hx-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="owner" title="About the Developer / Owner">
          <p className="hx-lead">Hi, I am Jhon Vincent M. Vitto from the Philippines.</p>
          <ul className="hx-list">
            {OWNER.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </Section>

        <Section id="contact" title="Contact / Feedback">
          <div className="hx-cards">
            {CONTACTS.map((c) => (
              <div className="hx-card" key={c.name}>
                <h3>{c.name}</h3>
                <a href={`tel:${c.phone}`}>{c.phone}</a>
                <a href={`mailto:${c.mail}`}>{c.mail}</a>
              </div>
            ))}
          </div>
          <form className="hx-form" onSubmit={send}>
            <label>
              Name
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Gmail
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Feedback / Recommendation
              <textarea name="msg" rows="5" required />
            </label>
            <button type="submit" className="hx-btn hx-btn--solid">Send feedback</button>
          </form>
        </Section>

        <Section id="socials" title="Socials">
          <ul className="hx-socials">
            {SOCIALS.map(([name, handle, url]) => (
              <li key={name}>
                <a href={url} {...(url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <span>{name}</span>
                  <b>{handle}</b>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="hx-foot">
        <div className="hx-foot-top">
          <strong>Henix Type</strong>
          <nav aria-label="Footer">
            {NAV.map(([label, id]) => (
              <a
                key={id}
                href={`#hx-${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(id);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <p>Henix Type helps you improve your typing skills and create more value and opportunity.</p>
        <p>Let’s improve your typing skills, on computer or mobile.</p>
        <small>© 2026 Henix Type. All rights reserved.</small>
      </footer>

      {dlg && (
        <div className={`hx-dlg${dlg === 'closing' ? ' is-closing' : ''}`} onClick={cancel} onKeyDown={onDlgKey} role="presentation">
          <div className="hx-dlg-panel" role="dialog" aria-modal="true" aria-labelledby="hx-dlg-t" aria-describedby="hx-dlg-d" onClick={(e) => e.stopPropagation()}>
            <div className="hx-dlg-wave" aria-hidden="true">
              <svg viewBox="0 0 800 24" preserveAspectRatio="none">
                <path d={`M0 12 q25 -14 50 0${' t50 0'.repeat(15)}`} />
              </svg>
            </div>
            <h2 id="hx-dlg-t">Before you start</h2>
            <p id="hx-dlg-d">Are you sure you want to proceed, or do you want to know more about Henix Type?</p>
            <div className="hx-dlg-actions">
              <button type="button" className="hx-btn hx-btn--solid" onClick={proceed} autoFocus>Proceed</button>
              <button type="button" className="hx-btn" onClick={learnMore}>Learn more</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}