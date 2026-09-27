// The tech wall — the one place on this page that names technologies.
//
// The skill cards further down explain *how* the work gets done, so this list
// stays a plain, scannable index of *what* it is done with. Keeping the names
// here is what lets the cards drop their tag rows instead of repeating them.
//
// Icons are CSS alpha masks, so a single `currentColor` paints each one and both
// themes work with no per-icon CSS, no per-icon assets and no second set of
// light/dark variants. Most are official Simple Icons files (CC0); seven more
// (sql, aws, windows, canva, microsoftword, microsoftexcel, chatgpt) were added
// by hand from other sources. All are stored unmodified in public/icons/ so
// provenance stays obvious.
//
// The five entries that still have no logo are deliberate, not broken: Active
// Directory, Office 365, Endpoint & Hardware, Network Monitoring and Freebuff
// have no usable mark to draw on — the three product names are absent from
// Simple Icons, and the two concept entries have no product mark at all. They
// render as text chips in the same shell, so the wall still reads as one system.
// Brand marks remain the property of their respective owners.

const iconUrl = (slug) => `${import.meta.env.BASE_URL}icons/${slug}.svg`;

const GROUPS = [
  {
    title: 'Languages & Frameworks',
    items: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Python', icon: 'python' },
      { name: 'SQL', icon: 'sql' },
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'HTML5', icon: 'html5' },
      { name: 'CSS3', icon: 'css' },
    ],
  },
  {
    title: 'Platforms & Infrastructure',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'SQLite', icon: 'sqlite' },
      { name: 'Redis', icon: 'redis' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'GitHub Actions', icon: 'githubactions' },
      { name: 'Vercel', icon: 'vercel-light' },
      { name: 'AWS', icon: 'aws' },
      { name: 'Vite', icon: 'vite' },
    ],
  },
  {
    title: 'Tools & Workflow',
    items: [
      // These two are the exception to the mask treatment. Their letters are
      // painted opaquely on top of the artwork, so a mask flattens them into a
      // solid block; asImage paints the file itself instead, which keeps the
      // official marks and their letter. See the .as-image rules in styles.css.
      { name: 'Microsoft Word', icon: 'microsoftword', asImage: true },
      { name: 'Excel', icon: 'microsoftexcel', asImage: true },
      { name: 'Canva', icon: 'canva' },
      { name: 'ChatGPT', icon: 'chatgpt' },
      { name: 'Claude', icon: 'claude' },
      { name: 'Freebuff' },
    ],
  },
  {
    title: 'IT & Support',
    items: [
      { name: 'Windows', icon: 'windows' },
      { name: 'Active Directory' },
      { name: 'Office 365' },
      { name: 'Endpoint & Hardware' },
      { name: 'Network Monitoring' },
    ],
  },
];

export default function TechStack() {
  return (
    <div className="tech-stack reveal">
      <h3 className="stack-title">My tech stack</h3>
      <p className="stack-subtitle">
        The technologies I use to develop applications, manage systems, and turn ideas into working solutions.
      </p>

      {GROUPS.map((group) => (
        <div className="stack-group" key={group.title}>
          <h4 className="stack-group-title">{group.title}</h4>
          <ul className="stack-chips">
            {group.items.map((item) => (
              <li className="tech-chip" key={item.name}>
                {item.icon && (
                  <span
                    className={`tech-chip-icon${item.asImage ? ' as-image' : ''}`}
                    style={{ '--tech-icon': `url("${iconUrl(item.icon)}")` }}
                    aria-hidden="true"
                  ></span>
                )}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
