import Image from "next/image";

function CabinCard({ cabin }) {
  const { id, name, max_capacity, regular_price, discount, image } = cabin;

  return (
    <div className="flex flex-col border border-primary-800 rounded-sm overflow-hidden hover:scale-[1.01] transition-all duration-300">
      <div className="relative aspect-[3/2]">
        <Image
          src={image}
          fill
          alt={`Cabin ${name}`}
          className="object-cover"
        />
      </div>

      <div className="flex-grow px-8 py-6 bg-primary-950 flex flex-col justify-between">
        <div>
          <h3 className="text-accent-500 font-semibold text-2xl mb-2">
            Cabin {name}
          </h3>

          <div className="flex gap-3 items-center mb-4">
            <span className="text-primary-300 text-lg">
              For up to {max_capacity} guests
            </span>
          </div>

          <div className="flex gap-3 items-baseline mb-6">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-[400] text-primary-50">
                  ${regular_price - discount}
                </span>
                <span className="line-through font-semibold text-primary-600">
                  ${regular_price}
                </span>
              </>
            ) : (
              <span className="text-3xl font-[400] text-primary-50">
                ${regular_price}
              </span>
            )}
            <span className="text-primary-400">/ night</span>
          </div>
        </div>

        <div className="border-t border-t-primary-900 pt-5 text-right">
          <a
            href={`/cabins/${id}`}
            className="inline-block border border-accent-800 py-3 px-8 text-accent-400 hover:bg-accent-600 transition-all hover:text-primary-900 font-medium"
          >
            Details & reservation &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

export default CabinCard;
