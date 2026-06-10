import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col">
      <header className="bg-white border-b border-[#e0e0e0] px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <span className="text-[#0a66c2] font-bold text-2xl tracking-tight select-none">
              aukcija
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col">{children}</div>

      <footer className="py-6 text-center text-xs text-[#666] space-x-3">
        <span>© 2026 aukcija</span>
        <Link
          href="/privatnost"
          className="hover:underline hover:text-[#0a66c2]"
        >
          Privatnost
        </Link>
        <Link href="/uslovi" className="hover:underline hover:text-[#0a66c2]">
          Uslovi korišćenja
        </Link>
      </footer>
    </div>
  );
}
