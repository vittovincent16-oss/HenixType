import { useLayoutEffect, useRef, useState } from 'react';
import '../styles/navbar.css';

const LINKS = [
  ['home', 'Home'],
  ['dashboard', 'Dashboard'],
  ['statistics', 'Statistics'],
  ['settings', 'Settings'],
];

export default function Navbar({ currentView, setCurrentView }) {
  const headerRef = useRef(null);
  const list = useRef(null);
  const [bar, setBar] = useState({ x: 0, w: 0 });

  // Slides the active wave indicator under the selected page link
  useLayoutEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const place = () => {
      const el = ul.querySelector('[aria-current="page"]');
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [currentView]);

  const handleNavbarMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    headerRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    headerRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <header className="nv" ref={headerRef} onMouseMove={handleNavbarMouseMove}>
      <div className="nv-inner">
        <button type="button" className="nv-brand" onClick={() => setCurrentView('landing')}>
          <svg className="nv-mark" viewBox="0 0 26 12" aria-hidden="true">
            <path d="M0 6 q3.25 -8 6.5 0 t6.5 0 t6.5 0 t6.5 0" />
          </svg>
          Henix Type
        </button>

        <nav aria-label="Main">
          <ul className="nv-links" ref={list}>
            <li
              className="nv-bar"
              aria-hidden="true"
              style={{ transform: `translateX(${bar.x}px)`, width: bar.w }}
            />
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  className="nv-link"
                  aria-current={currentView === id ? 'page' : undefined}
                  onClick={() => setCurrentView(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}