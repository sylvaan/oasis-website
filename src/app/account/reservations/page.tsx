import Link from "next/link";

export const metadata = {
  title: "Reservations | The Wild Oasis",
};

export default function Page() {
  // Temporary empty state
  const bookings = [];

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
        <ul className="flex flex-col gap-6">
          {/* Reservation cards will be added later */}
          <li>Reservation cards placeholder</li>
        </ul>
      )}
    </div>
  );
}
