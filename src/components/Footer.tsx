const Footer = () => {
  const cols = [
    { title: "Shop", items: ["Sofas", "Chairs", "Tables", "Beds"] },
    { title: "Company", items: ["About", "Sustainability", "Press", "Careers"] },
    { title: "Support", items: ["Contact", "Shipping", "Returns", "FAQ"] },
  ];
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-foreground">Maison</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Considered furniture for slow living. Made to last, designed to feel like home.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-foreground">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-muted-foreground transition-smooth hover:text-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Maison. All rights reserved.</p>
          <p>Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
