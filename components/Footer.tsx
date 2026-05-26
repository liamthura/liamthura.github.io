// Footer.tsx - Simple footer with credit line

export function Footer() {
  return (
    <footer className="bg-ink border-t border-ink-fg/10 py-8">
      <div className="container-main flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-ink-fg/60 text-sm">
          Built by Liam Thura and Claude helped (why not?) · Newcastle upon
          Tyne, UK · Probably need more sleep
        </p>
      </div>
    </footer>
  );
}
