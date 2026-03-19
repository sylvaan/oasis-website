"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteBookingAction } from "@/app/_lib/actions";

function ReservationList({ bookings }: { bookings: any[] }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBookingAction(bookingId);
  }

  return (
    <ul className="flex flex-col gap-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
