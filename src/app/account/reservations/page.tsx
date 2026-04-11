import ReservationListWrapper from "@/app/_components/ReservationListWrapper";
import Spinner from "@/app/_components/Spinner";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reservations | The Wild Oasis",
};

export default async function Page() {
  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      <Suspense fallback={<Spinner />}>
        <ReservationListWrapper />
      </Suspense>
    </div>
  );
}
