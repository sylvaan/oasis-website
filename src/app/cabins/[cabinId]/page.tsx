import { getCabin, getCabins } from "@/app/_lib/data-service";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";
import {
  EyeSlashIcon,
  MapPinIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

// This helps Next.js generate all cabin pages at build time (optional but good for perf)
export async function generateStaticParams() {
  const cabins = await getCabins();
  const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
  return ids;
}

export async function generateMetadata({ params }) {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);
  if (!cabin) return { title: "Cabin Not Found" };
  return { title: `Cabin ${cabin.name}` };
}

export default async function Page({ params }) {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);

  if (!cabin) notFound();

  const { id, name, max_capacity, regular_price, discount, image, description } =
    cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Link
        href="/cabins"
        className="inline-block mb-8 text-primary-300 hover:text-accent-400 transition-colors flex items-center gap-2"
      >
        &larr; Back to all cabins
      </Link>

      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
        <div className="relative scale-[1.15] -translate-x-3">
          <Image
            src={image}
            fill
            className="object-cover"
            alt={`Cabin ${name}`}
          />
        </div>

        <div>
          <h3 className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
            Cabin {name}
          </h3>

          <p className="text-lg text-primary-300 mb-10 text-justify">
            {description}
          </p>

          <ul className="flex flex-col gap-4 mb-7">
            <li className="flex gap-3 items-center">
              <UsersIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                For up to <span className="font-bold">{max_capacity}</span>{" "}
                guests
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <MapPinIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Located in the heart of the <span className="font-bold">Dolomites</span> (Italy)
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <EyeSlashIcon className="h-5 w-5 text-primary-600" />
              <span className="text-lg">
                Privacy <span className="font-bold">100%</span> guaranteed
              </span>
            </li>
          </ul>

          <div className="flex gap-3 items-baseline">
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
      </div>

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve Cabin {name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
