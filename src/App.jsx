import { useState, useEffect, useCallback } from 'react';
import ShaderBackground from './components/ShaderBackground';
import './styles.css';

function useThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    const switchTheme = () => setTheme(next);

    if (typeof document !== 'undefined' && document.startViewTransition) {
      document.startViewTransition(switchTheme);
    } else {
      switchTheme();
    }
  };

  return { theme, toggle };
}

export default function App(){
  const { theme, toggle: toggleTheme } = useThemeToggle();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Reset menu when resizing to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <ShaderBackground />
      <div className="portfolio-layer">

  <div className="scroll-progress" id="scroll-progress" aria-hidden="true"></div>
  <div className="page-glow glow-one"></div>
  <div className="page-glow glow-two"></div>

  <header className="site-header">
    <nav className="nav container" aria-label="Main navigation">
      <a className="brand" href="#top" aria-label="Leo Jasper Ladica home">
        <span className="brand-mark">LJ</span>
        <span>Leo Jasper<span className="brand-dot">.</span></span>
      </a>

      <div className="nav-links" id="nav-links">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#certifications">Certifications</a>
        <a href="#contact">Contact</a>
      </div>

      <div className="nav-controls">
        <button className="theme-toggle" type="button" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme}>
          <svg className="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg className="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        <button className={`menu-toggle${menuOpen ? ' is-open' : ''}`} type="button" aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(o => !o)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    {/* Mobile navigation panel */}
    <div id="mobile-nav" className={`mobile-nav${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
      <div className="mobile-nav-inner container">
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#experience" onClick={closeMenu}>Experience</a>
        <a href="#skills" onClick={closeMenu}>Skills</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#certifications" onClick={closeMenu}>Certifications</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </div>
    </div>
  </header>

  <main>
    <section className="hero section container">
      <div className="hero-copy reveal">
        <div className="eyebrow"><span className="status-dot"></span> Davao City, Philippines · Open to opportunities</div>
        <p className="kicker">IT SUPPORT · SYSTEMS · NETWORKING · FULL-STACK</p>
        <h1>I keep technology reliable and make systems easier to use.</h1>
        <p className="hero-text">
          I’m <strong>Leo Jasper V. Ladica</strong>, an Information Technology professional with hands-on experience in IT support,
          system monitoring, network maintenance, desktop troubleshooting, Active Directory, and full-stack development.
          I focus on dependable technical support and practical improvements that help business operations run smoothly.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects">View my work <span aria-hidden="true">↗</span></a>
          <a className="btn btn-secondary" href="Leo_Jasper_Ladica_Resume.pdf" target="_blank" rel="noopener">View résumé</a>
          <a className="btn btn-secondary" href="#contact">Contact me</a>
        </div>

        <div className="hero-stats" aria-label="Highlights">
          <div><strong>IT Staff</strong><span>Sta. Lucia Mall Davao</span></div>
          <div><strong>BSIT</strong><span>Healthcare Technologies</span></div>
          <div><strong>3 Certifications</strong><span>React, JavaScript & AWS</span></div>
        </div>
      </div>

      <div className="hero-panel reveal">
  <div className="hero-visual-group">
    <div className="terminal-card">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>leo@portfolio:~</span>
      </div>

      <div className="terminal-body">
        <p>
          <span className="prompt">$</span> whoami
        </p>

        <p className="terminal-output">
          Leo Jasper V. Ladica
          <br />
          IT Staff / Technical Support
        </p>

        <p>
          <span className="prompt">$</span> cat expertise.txt
        </p>

        <p className="terminal-output">
          IT Support &amp; Troubleshooting
          <br />
          Active Directory
          <br />
          Network Maintenance
          <br />
          ICT Hardware &amp; Endpoints
          <br />
          Full-Stack Development
          <br />
          Technical Documentation
        </p>

        <p>
          <span className="prompt">$</span> status --career
        </p>

        <p className="terminal-output success">
          supporting · learning · improving ✓
        </p>
      </div>
    </div>

    <div className="floating-card floating-top">
      <span className="mini-icon">01</span>
      <div><strong>Support</strong><small>Diagnose. Resolve. Document.</small></div>
    </div>
    <div className="floating-card floating-bottom">
      <span className="mini-icon">02</span>
      <div><strong>Improve</strong><small>Maintain. Simplify. Build.</small></div>
    </div>
  </div>
</div>
    </section>

    <section className="section section-muted" id="about">
      <div className="container split-layout">
        <div className="section-heading reveal">
          <p className="kicker">ABOUT ME</p>
          <h2>Technical support with a practical, user-focused mindset.</h2>
        </div>
        <div className="about-copy reveal">
          <p>
            I graduated from the <strong>University of the Immaculate Conception</strong> with a
            <strong>Bachelor of Science in Information Technology</strong>, majoring in <strong>Healthcare Technologies</strong>.
            My current role as an IT Staff member has given me hands-on experience supporting users, maintaining network and ICT
            infrastructure, managing endpoints, administering Active Directory, and keeping technical documentation up to date.
          </p>
          <p>
            Beyond support, I also build full-stack applications — I designed and built an internal ticketing system for my current
            company and a retail point-of-sale system end to end, working across React frontends, API backends, authentication,
            and databases. I got my start in development through a frontend-focused internship fixing code issues, redesigning
            UI components, improving system navigation, and testing new features. I enjoy work that combines troubleshooting,
            attention to detail, continuous learning, and practical improvements to existing systems.
          </p>
        </div>
      </div>
    </section>

    <section className="section container" id="experience">
      <div className="section-heading center reveal">
        <p className="kicker">EXPERIENCE</p>
        <h2>Hands-on IT operations and development experience</h2>
        <p>Supporting infrastructure and users today, backed by practical software development experience.</p>
      </div>

      <div className="timeline reveal">
        <article className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-meta">
            <span className="badge">July 2025 — Present</span>
            <h3>IT Staff</h3>
            <p>Sta. Lucia Mall Davao</p>
          </div>
          <div className="timeline-content">
            <ul>
              <li>Monitor and maintain network infrastructure to support stable connectivity and reliable day-to-day operations.</li>
              <li>Monitor and maintain ICT hardware, network devices, and IT equipment for optimal performance.</li>
              <li>Configure, deploy, troubleshoot, and maintain desktop computers, laptops, printers, and other IT devices.</li>
              <li>Provide technical support for hardware, software, network, and user-related issues.</li>
              <li>Administer Active Directory, including account creation, password resets, permissions, and user/group management.</li>
              <li>Maintain IT asset inventory and technical documentation.</li>
            </ul>
          </div>
        </article>

        <article className="timeline-item">
          <div className="timeline-marker"></div>
          <div className="timeline-meta">
            <span className="badge badge-secondary">January — March 2025</span>
            <h3>Intern</h3>
            <p>MinNa Lproc R&amp;D Laboratory</p>
          </div>
          <div className="timeline-content">
            <ul>
              <li>Improved and fixed code issues in the system to enhance functionality and reduce errors.</li>
              <li>Redesigned system UI components to create a more intuitive interface.</li>
              <li>Enhanced user workflow and system navigation experience.</li>
              <li>Helped test the system and add new features.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section className="section section-muted" id="skills">
      <div className="container">
        <div className="section-heading reveal">
          <p className="kicker">TECHNICAL SKILLS</p>
          <h2>A practical IT toolkit</h2>
        </div>

        <div className="skills-grid reveal">
          <article className="skill-card">
            <div className="skill-number">01</div>
            <h3>IT Support</h3>
            <p>Desktop and laptop troubleshooting, hardware and software support, printer support, diagnostics, and user assistance.</p>
            <div className="tags"><span>Windows</span><span>Hardware</span><span>Software</span><span>End-user Support</span></div>
          </article>
          <article className="skill-card">
            <div className="skill-number">02</div>
            <h3>Systems & Access</h3>
            <p>User account administration, password resets, permissions, group management, and endpoint configuration.</p>
            <div className="tags"><span>Active Directory</span><span>User Accounts</span><span>Permissions</span><span>Endpoints</span></div>
          </article>
          <article className="skill-card">
            <div className="skill-number">03</div>
            <h3>Networking</h3>
            <p>Network infrastructure monitoring, connectivity troubleshooting, network-device maintenance, and issue isolation.</p>
            <div className="tags"><span>Network Monitoring</span><span>Connectivity</span><span>Network Devices</span><span>Troubleshooting</span></div>
          </article>
          <article className="skill-card">
            <div className="skill-number">04</div>
            <h3>Full-Stack Development</h3>
            <p>Building complete applications — from React frontends to REST APIs, authentication, and database-backed backends.</p>
            <div className="tags"><span>React</span><span>Next.js</span><span>FastAPI</span><span>NestJS</span><span>PostgreSQL</span><span>TypeScript</span></div>
          </article>
          <article className="skill-card">
            <div className="skill-number">05</div>
            <h3>Productivity & Design</h3>
            <p>Creating and maintaining clear business documents, spreadsheets, presentations, and visual materials.</p>
            <div className="tags"><span>Microsoft Word</span><span>Excel</span><span>Canva</span><span>Documentation</span></div>
          </article>
          <article className="skill-card">
            <div className="skill-number">06</div>
            <h3>Professional Strengths</h3>
            <p>Problem-solving, analytical thinking, adaptability, continuous learning, and attention to detail.</p>
            <div className="tags"><span>Problem Solving</span><span>Analytical</span><span>Adaptability</span><span>Detail-oriented</span></div>
          </article>
        </div>
      </div>
    </section>

    <section className="section container" id="projects">
      <div className="section-heading reveal">
        <p className="kicker">SELECTED WORK</p>
        <h2>Examples of how I approach IT problems</h2>
        <p className="section-intro">A mix of support, infrastructure, and system-improvement work from my practical experience.</p>
      </div>

      <div className="projects-grid">
        <article className="project-card featured reveal">
          <div className="project-visual visual-ticket">
            <div className="screenshot-stack">
              <figure className="screenshot-frame shot-primary">
                <div className="screenshot-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                <img src="images/Ticketsystem.png" alt="Internal Ticketing System UI — ticket list view" width="1854" height="951" loading="lazy" />
              </figure>
              <figure className="screenshot-frame shot-secondary">
                <div className="screenshot-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                <img src="images/Ticketsystem2.png" alt="Internal Ticketing System UI — ticket details view" width="1831" height="954" loading="lazy" />
              </figure>
            </div>
          </div>
          <div className="project-copy">
            <div className="project-topline"><span>FULL-STACK</span><span>01</span></div>
            <h3>Internal Ticketing System</h3>
            <p>
              A full-stack internal IT ticketing system I designed and built end to end for my current company — React + Vite
              single-page frontend, a Python FastAPI REST API with JWT-authenticated role-based login, SQLite for lightweight
              setups, and PostgreSQL (Docker/production) managed through Alembic migrations. Covers ticket creation and views,
              dashboards, teams, configuration pages, custom fields, audit logs, filtering, and access control — and I keep
              improving its interface and workflows to make day-to-day use cleaner and more consistent.
            </p>
            <div className="tags"><span>React</span><span>Vite</span><span>FastAPI</span><span>PostgreSQL</span><span>SQLite</span><span>JWT Auth</span><span>Alembic</span><span>GitHub Actions</span></div>
          </div>
        </article>

        <article className="project-card featured reveal">
          <div className="project-visual visual-pos">
            <div className="screenshot-stack">
              <figure className="screenshot-frame shot-pos-primary">
                <div className="screenshot-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                <img src="images/Retail-Pos.png" alt="Retail POS System — sales screen" width="1861" height="945" loading="lazy" />
              </figure>
              <figure className="screenshot-frame shot-pos-secondary">
                <div className="screenshot-bar" aria-hidden="true"><span></span><span></span><span></span></div>
                <img src="images/Retail-Pos2.png" alt="Retail POS System — inventory and product management view" width="1866" height="881" loading="lazy" />
              </figure>
            </div>
          </div>
          <div className="project-copy">
            <div className="project-topline"><span>FULL-STACK</span><span>02</span></div>
            <h3>Retail POS System</h3>
            <p>
              A full-stack retail point-of-sale system built as a monorepo — Next.js frontend, NestJS API, PostgreSQL for
              transactional data, and Redis for realtime sync. Covers PIN-based staff login with roles, fast barcode/SKU checkout,
              inventory management, returns, supplier and purchase tracking, customer loyalty, and sales reporting — with an
              offline-capable PWA frontend.
            </p>
            <div className="tags"><span>Next.js</span><span>NestJS</span><span>PostgreSQL</span><span>Redis</span><span>TypeScript</span></div>
            <a className="text-link project-link" href="https://github.com/jasz03/Retail-Pos" target="_blank" rel="noopener">View on GitHub ↗</a>
          </div>
        </article>

        <article className="project-card reveal">
          <div className="project-copy">
            <div className="project-topline"><span>IT OPERATIONS</span><span>03</span></div>
            <h3>Endpoint & User Administration</h3>
            <p>
              Configure and support workstations and user access, including desktop deployment, troubleshooting, Active Directory
              administration, account permissions, and day-to-day endpoint maintenance.
            </p>
            <div className="tags"><span>Windows</span><span>Active Directory</span><span>Endpoints</span><span>User Support</span></div>
          </div>
        </article>

        <article className="project-card reveal">
          <div className="project-copy">
            <div className="project-topline"><span>NETWORK SUPPORT</span><span>04</span></div>
            <h3>Network & ICT Infrastructure Support</h3>
            <p>
              Monitor network infrastructure and ICT equipment, troubleshoot connectivity and device issues, and help maintain reliable
              operation of network devices and workplace technology.
            </p>
            <div className="tags"><span>Networking</span><span>Monitoring</span><span>ICT Hardware</span><span>Troubleshooting</span></div>
          </div>
        </article>

      </div>
    </section>

    <section className="section section-muted" id="education">
      <div className="container education-card reveal">
        <div>
          <p className="kicker">EDUCATION</p>
          <h2>Bachelor of Science in Information Technology</h2>
          <p className="education-specialization">Major in Healthcare Technologies · 2021–2025</p>
        </div>
        <div className="education-note">
          <span>University</span>
          <p>University of the Immaculate Conception</p>
        </div>
      </div>
    </section>

    <section className="section container" id="certifications">
      <div className="section-heading reveal">
        <p className="kicker">CERTIFICATIONS</p>
        <h2>Continuous learning beyond the classroom</h2>
      </div>
      <div className="cert-grid reveal">
        <article className="cert-card">
          <span className="cert-year">2025</span>
          <h3>Frontend Development using React</h3>
          <p>Frontend development and component-based web application skills.</p>
        </article>
        <article className="cert-card">
          <span className="cert-year">2025</span>
          <h3>JavaScript for Web Development</h3>
          <p>JavaScript fundamentals and practical web development concepts.</p>
        </article>
        <article className="cert-card">
          <span className="cert-year">2025</span>
          <h3>AWS Certified Solutions Architect</h3>
          <p>Cloud architecture concepts and AWS solution design.</p>
        </article>
      </div>
    </section>

    <section className="section section-muted profile-strip">
      <div className="container profile-strip-inner reveal">
        <div>
          <p className="kicker">WORK STYLE</p>
          <h2>Reliable support. Clear documentation. Continuous improvement.</h2>
        </div>
        <div className="strength-list" aria-label="Professional strengths">
          <span>Problem-solving</span>
          <span>Analytical thinking</span>
          <span>Adaptability</span>
          <span>Continuous learning</span>
          <span>Attention to detail</span>
        </div>
      </div>
    </section>

    <section className="section container contact-section" id="contact">
      <div className="contact-card reveal">
        <div>
          <p className="kicker">LET’S CONNECT</p>
          <h2>Looking for reliable IT support with room to grow?</h2>
          <p>I’m open to IT support, systems administration, technical operations, network support, and full-stack or frontend development roles.</p>
        </div>
        <div className="contact-actions">
          <a className="btn btn-primary" href="mailto:leojasperladica0@gmail.com">Email me</a>
          <a className="text-link" href="https://www.linkedin.com/in/leo-jasper-ladica-585182367" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a className="text-link" href="https://github.com/jasz03" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="text-link" href="https://www.facebook.com/leojasper.ladica.1" target="_blank" rel="noopener noreferrer">Facebook ↗</a>
          <a className="text-link" href="Leo_Jasper_Ladica_Resume.pdf" target="_blank" rel="noopener">Résumé ↗</a>
        </div>
      </div>
      <div className="contact-meta reveal">
        <a href="mailto:leojasperladica0@gmail.com">leojasperladica0@gmail.com</a>
        <span>Davao City, Region XI, Philippines</span>
      </div>
    </section>
  </main>

  <footer className="footer">
    <div className="container footer-inner">
      <p>© <span id="year"></span> Leo Jasper V. Ladica. Built for the web.</p>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>

  <button className="back-to-top" id="back-to-top" type="button" aria-label="Back to top">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
  </button>

  

      </div>
    </>
  );
}
