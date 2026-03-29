import ReservationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings, getGuest } from "@/app/_lib/data-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservations | The Wild Oasis",
};

export default async function Page() {
  const session = await auth();
  if (!session || !session.user) return null;

  let guestId = session.user.guestId;

  // Recovery: If guestId is missing from session, fetch it manually
  if (!guestId && session.user.email) {
    const guest = await getGuest(session.user.email);
    if (guest) guestId = guest.id;
  }

  const bookings = guestId ? await getBookings(guestId) : [];

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
