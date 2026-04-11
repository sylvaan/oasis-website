import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import { ClockIcon } from "@heroicons/react/24/outline";


import DeleteReservation from "./DeleteReservation";
import Image from "next/image";
import Link from "next/link";
import { type Booking } from "./ReservationList";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, onDelete }: { booking: Booking, onDelete: (bookingId: number) => void }) {
  const {
    id,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    isEarlyCheckin,
    created_at,
    cabins: { name, image },
  } = booking;


  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          src={image}
          fill
          alt={`Cabin ${name}`}
          className="object-cover border-r border-primary-800"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AOf9nB9+AAAAABJRU5ErkJggg=="
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          {isPast(new Date(startDate)) ? (
            <span className="bg-yellow-800 text-yellow-200 h-6 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-6 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <div className="flex gap-4 items-center mb-2">
          <p className="text-lg text-primary-300">
            {format(new Date(startDate), "EEE, MMM dd yyyy")} (
            {isToday(new Date(startDate))
              ? "Today"
              : formatDistanceFromNow(startDate)}
            ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
          </p>
          {isEarlyCheckin && (
            <span className="flex items-center gap-1 bg-accent-600 text-primary-900 h-6 px-2 lowercase text-xs font-bold rounded-sm">
              <ClockIcon className="h-4 w-4" />
              <span>early check-in (8 am)</span>
            </span>
          )}
        </div>


        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-500">${totalPrice}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests > 1 && "s"}
          </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(new Date(created_at), "MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        {!isPast(new Date(startDate)) ? (
            <>
            <Link
          href={`/account/reservations/edit/${id}`}
          className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-all hover:text-primary-900"
        >
          <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-all" />
          <span className="mt-1">Edit</span>
        </Link>
        <DeleteReservation bookingId={id} onDelete={onDelete} />
            </>
        ) : null}
      </div>
    </div>
  );
}

export default ReservationCard;
