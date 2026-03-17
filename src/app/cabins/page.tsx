import { getCabinsFromSupabase } from "../_lib/cabins-service";
import Image from "next/image";

export const metadata = {
  title: "Cabins | The Wild Oasis",
};

export default async function Page() {
  const cabins = await getCabinsFromSupabase();

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to stunning mountain views, spending your
        days exploring the dark forests around you, or just relaxing in your
        private hot tub under the stars. Enjoy nature&apos;s beauty in your own
        little home away from home. The perfect spot for a peaceful, calm
        vacation. Welcome to paradise.
      </p>

      {cabins.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-14">
          {cabins.map((cabin) => (
            <div
              key={cabin.id}
              className="flex flex-col border border-primary-800 rounded-sm overflow-hidden hover:scale-[1.01] transition-all duration-300"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={cabin.image}
                  fill
                  alt={cabin.name}
                  className="object-cover"
                />
              </div>

              <div className="flex-grow px-8 py-6 bg-primary-950 flex flex-col justify-between">
                <div>
                  <h3 className="text-accent-500 font-semibold text-2xl mb-2">
                    Cabin {cabin.name}
                  </h3>

                  <div className="flex gap-3 items-center mb-4">
                    <span className="text-primary-300 text-lg">
                      For up to {cabin.max_capacity} guests
                    </span>
                  </div>

                  <div className="flex gap-3 items-baseline mb-6">
                    {cabin.discount > 0 ? (
                      <>
                        <span className="text-3xl font-[400] text-primary-50">
                          ${cabin.regular_price - cabin.discount}
                        </span>
                        <span className="line-through font-semibold text-primary-600">
                          ${cabin.regular_price}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-[400] text-primary-50">
                        ${cabin.regular_price}
                      </span>
                    )}
                    <span className="text-primary-400">/ night</span>
                  </div>
                </div>

                <div className="border-t border-t-primary-900 pt-5 text-right">
                  <a
                    href={`/cabins/${cabin.id}`}
                    className="inline-block border border-accent-800 py-3 px-8 text-accent-400 hover:bg-accent-600 transition-all hover:text-primary-900 font-medium"
                  >
                    Details & reservation &rarr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
