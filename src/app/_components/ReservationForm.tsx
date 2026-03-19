"use client";

import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import SubmitButton from "./SubmitButton";
import { createBookingAction } from "@/app/_lib/actions";
import Image from "next/image";

interface Cabin {
  id: number;
  max_capacity: number;
  regular_price: number;
  discount: number;
}

interface User {
  name?: string | null;
  image?: string | null;
  guestId?: number;
}

function ReservationForm({ cabin, user }: { cabin: Cabin; user: User }) {
  const { range, resetRange } = useReservation();
  const { max_capacity, regular_price, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regular_price - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBookingAction.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <div className="relative h-8 w-8">
            <Image
              // Important to display google profile images
              referrerPolicy="no-referrer"
              className="rounded-full object-cover"
              src={user.image!}
              alt={user.name!}
              fill
            />
          </div>
          <p>{user.name}</p>
        </div>
      </div>

      <form
        // action={createBookingWithData}
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: max_capacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
