import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0b0d13] px-6 text-center">
      <div>
        <p className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-6xl font-bold text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
          The link may be outdated. Head back home, or jump straight into the studio and start modeling.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Back home
          </Link>
          <Link href="/studio" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
            Launch studio
          </Link>
        </div>
      </div>
    </div>
  );
}
