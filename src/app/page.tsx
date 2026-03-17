import Link from "next/link";

export default function Page() {
  return (
    <main className="mt-24 text-center">
      <h1 className="text-8xl text-primary-50 mb-10 tracking-tight font-normal">
        Welcome to paradise.
      </h1>
      <Link
        href="/cabins"
        className="bg-accent-500 px-8 py-6 text-primary-950 text-xl font-semibold hover:bg-accent-600 transition-all"
      >
        Explore luxury cabins
      </Link>
    </main>
  );
}
