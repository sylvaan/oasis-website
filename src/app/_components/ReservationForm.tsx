"use client";

import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import SubmitButton from "./SubmitButton";
import { createBookingAction } from "@/app/_lib/actions";
import Image from "next/image";
import { useState } from "react";

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

interface Settings {
  min_booking_length: number;
  max_booking_length: number;
  max_guests_per_booking: number;
  breakfast_price: number;
}

function ReservationForm({
  cabin,
  user,
  settings,
}: {
  cabin: Cabin;
  user: User;
  settings: Settings;
}) {
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const { range, resetRange } = useReservation();
  const { max_capacity, regular_price, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;
  const cabinPrice = numNights * (regular_price - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
    hasBreakfast,
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
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-8 lg:px-16 text-lg flex gap-5 flex-col"
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

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="hasBreakfast"
            id="hasBreakfast"
            className="h-5 w-5 accent-accent-500"
            checked={hasBreakfast}
            onChange={() => setHasBreakfast((s) => !s)}
          />
          <label htmlFor="hasBreakfast">
            Want to add breakfast for ${settings.breakfast_price}?
          </label>
        </div>

        <div className="flex justify-end items-center gap-6 pt-2">
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
