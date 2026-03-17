/**
 * about/page.tsx
 * 
 * 📂 KONSEP: File-based Routing
 * Karena file ini ada di dalam folder 'about', maka URL-nya otomatis menjadi /about.
 */
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | The Wild Oasis",
};

export default function Page() {
  return (
    <div className="grid grid-cols-5 gap-x-24 gap-y-32 text-lg items-center">
      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Welcome to The Wild Oasis
        </h1>

        <div className="space-y-8">
          <p>
            Where nature&apos;s beauty and comfortable living blend seamlessly.
            Hidden away in the heart of the Italian Dolomites, this is your
            paradise away from home. But it&apos;s not just about the luxury
            cabins. It&apos;s about the experience of reconnecting with nature
            and enjoying simple pleasures with family.
          </p>
          <p>
            Our 8 luxury cabins provide a cozy base, but the real freedom awaits
            in the surrounding mountains. Wander through pristine forests,
            breathe in the fresh air, and watch the stars sparkle above the
            snow-capped peaks from your private hot tub.
          </p>
          <p>
            This is where memorable moments are made, surrounded by untouched
            nature. It&apos;s a place to slow down, relax, and feel the joy of
            being together in a beautiful setting.
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <Image
          src="/about-1.png"
          width={500}
          height={300}
          alt="Family sitting around a fire pit in front of cabin"
          className="rounded-lg shadow-2xl"
        />
      </div>

      <div className="col-span-2">
        <Image
          src="/about-2.png"
          width={500}
          height={500}
          alt="Interior of a luxury cabin"
          className="rounded-lg shadow-2xl"
        />
      </div>

      <div className="col-span-3">
        <h1 className="text-4xl mb-10 text-accent-400 font-medium">
          Managed by our family since 1962
        </h1>

        <div className="space-y-8">
          <p>
            Since 1962, The Wild Oasis has been a cherished family-run retreat.
            Started by our grandparents, this haven has been nurtured with love
            and care, passing down through our family as a testament to our
            dedication to creating a sensible-yet-luxurious retreat in nature.
          </p>
          <p>
            Over the years, we&apos;ve maintained the rustic charm of our
            cabins while gently introducing modern comforts to ensure your
            stay is as relaxing as it is memorable. It&apos;s our privilege to
            share this special part of the world with you, and we hope you find
            the same peace and connection that we have over the decades.
          </p>

          <div>
            <Link
              href="/cabins"
              className="inline-block mt-4 bg-accent-500 px-8 py-5 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
            >
              Explore our luxury cabins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
