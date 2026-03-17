import Image from "next/image";

export const metadata = {
  title: "Cabins | The Wild Oasis",
};

export default function Page() {
  // MOCK DATA for now
  const cabins = [
    {
      id: "001",
      name: "Cabin 001",
      maxCapacity: 2,
      regularPrice: 250,
      discount: 0,
      image: "/cabin-1.png",
    },
    {
      id: "002",
      name: "Cabin 002",
      maxCapacity: 4,
      regularPrice: 350,
      discount: 50,
      image: "/cabin-2.png",
    },
    {
      id: "003",
      name: "Cabin 003",
      maxCapacity: 6,
      regularPrice: 550,
      discount: 0,
      image: "/cabin-3.png",
    },
  ];

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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
          {cabins.map((cabin) => (
            <div
              key={cabin.id}
              className="flex border border-primary-800 rounded-sm overflow-hidden"
            >
              <div className="relative flex-1">
                <Image
                  src={cabin.image}
                  fill
                  alt={cabin.name}
                  className="object-cover border-r border-primary-800"
                />
              </div>

              <div className="flex-grow px-10 py-5 bg-primary-950">
                <h3 className="text-accent-500 font-semibold text-2xl mb-3">
                  {cabin.name}
                </h3>

                <div className="flex gap-3 items-center mb-2">
                  <span className="text-primary-300">For up to {cabin.maxCapacity} guests</span>
                </div>

                <div className="flex gap-3 justify-end items-baseline">
                  {cabin.discount > 0 ? (
                    <>
                      <span className="text-3xl font-[350]">
                        ${cabin.regularPrice - cabin.discount}
                      </span>
                      <span className="line-through font-semibold text-primary-600">
                        ${cabin.regularPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-[350]">${cabin.regularPrice}</span>
                  )}
                  <span className="text-primary-200">/ night</span>
                </div>

                <div className="border-t border-t-primary-800 pt-5 text-right">
                  <a
                    href={`/cabins/${cabin.id}`}
                    className="border-primary-800 py-3 px-6 hover:bg-accent-600 transition-all hover:text-primary-900"
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
