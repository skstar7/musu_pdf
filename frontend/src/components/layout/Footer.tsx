export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 text-sm text-muted sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-base font-semibold text-foreground">Musu PDF</p>
          <p className="mt-2 max-w-sm">Professional PDF workflows with a monochrome-first, privacy-conscious architecture.</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">Product</p>
          <ul className="mt-2 space-y-1">
            <li>Organize PDF</li>
            <li>Convert PDF</li>
            <li>Optimize PDF</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-foreground">Security</p>
          <p className="mt-2">Files are private and processed through isolated jobs with retention controls.</p>
        </div>
      </div>
    </footer>
  );
}
