import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";
import { format } from "date-fns";


export async function generateMetadata({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  const booking = await getBooking(Number(bookingId));
  const cabin = await getCabin(booking.cabinId);
  return {
    title: `Edit Reservation for Cabin ${cabin?.name} | The Wild Oasis`,
  };
}

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  
  const booking = await getBooking(Number(bookingId));
  const cabin = await getCabin(booking.cabinId);
  const max_capacity = cabin?.max_capacity ?? 0;

  return (
    <div>
      <Link
        href="/account/reservations"
        className="flex items-center gap-2 text-primary-300 mb-6 hover:text-accent-400 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Back to reservations</span>
      </Link>

      <h2 className="font-semibold text-2xl text-accent-400 mb-2">
        Edit Your Reservation for Cabin {cabin?.name}
      </h2>

      <p className="text-lg text-primary-300 mb-7">
        {format(new Date(booking.startDate), "EEE, MMM dd yyyy")} &mdash; {format(new Date(booking.endDate), "EEE, MMM dd yyyy")}
      </p>

      <EditReservationForm booking={booking} maxCapacity={max_capacity} />
    </div>
  );
}

