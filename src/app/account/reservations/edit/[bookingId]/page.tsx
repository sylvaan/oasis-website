import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export async function generateMetadata({ params }: { params: { bookingId: string } }) {
  return {
    title: `Edit Reservation #${params.bookingId} | The Wild Oasis`,
  };
}

export default async function Page({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  
  const booking = await getBooking(Number(bookingId));
  const { max_capacity } = await getCabin(booking.cabin_id);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <EditReservationForm booking={booking} maxCapacity={max_capacity} />
    </div>
  );
}
