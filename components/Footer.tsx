// Footer.tsx - Simple footer with credit line

export function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 py-8">
      <div className="container-main flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/50 text-sm">
          Built by Liam Thura and Claude (why not?) · Newcastle upon Tyne, UK ·
          Probably need more sleep
        </p>
      </div>
    </footer>
  );
}
