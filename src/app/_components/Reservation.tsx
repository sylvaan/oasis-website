import { auth } from "@/app/_lib/auth";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import LoginMessage from "./LoginMessage";

import { ReservationProvider } from "./ReservationContext";

interface Cabin {
  id: number;
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  image: string;
}

async function Reservation({ cabin }: { cabin: Cabin }) {
  // We fetch both of these in parallel
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <ReservationProvider>
      <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
        <DateSelector
          settings={settings}
          bookedDates={bookedDates}
          cabin={cabin}
        />
        {session?.user ? (
          <ReservationForm cabin={cabin} user={session.user} />
        ) : (
          <LoginMessage />
        )}
      </div>
    </ReservationProvider>
  );
}

export default Reservation;
