"use client";

import { useActionState } from "react";
import { updateBookingAction, type ActionState } from "@/app/_lib/actions";
import SubmitButton from "@/app/_components/SubmitButton";

function EditReservationForm({ booking, maxCapacity }: { booking: { id: number; numGuests: number; observations: string, isEarlyCheckin: boolean }, maxCapacity: number }) {
  const { id, numGuests, observations, isEarlyCheckin } = booking;

  const [state, formAction] = useActionState(
    (prevState: ActionState, formData: FormData) =>
      updateBookingAction(prevState, formData),
    null
  );

  return (
    <form
      action={formAction}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      {state?.message && (
        <p
          className={`px-4 py-2 rounded-sm ${
            state.success ? "bg-green-600 text-green-50" : "bg-red-600 text-red-50"
          }`}
        >
          {state.message}
        </p>
      )}

      <input type="hidden" name="bookingId" value={id} />

      <div className="space-y-2">
        <label htmlFor="numGuests">How many guests?</label>
        <select
          name="numGuests"
          id="numGuests"
          defaultValue={numGuests}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          required
        >
          <option value="" key="">
            Select number of guests...
          </option>
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
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
          defaultValue={observations}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="isEarlyCheckin"
          id="isEarlyCheckin"
          defaultChecked={isEarlyCheckin}
          className="h-5 w-5 accent-accent-500"
        />
        <label htmlFor="isEarlyCheckin">
          Request early check-in (8 AM)?
        </label>
      </div>


      <div className="flex justify-end items-center gap-6">
        <SubmitButton pendingLabel="Updating...">Update reservation</SubmitButton>
      </div>
    </form>
  );
}

export default EditReservationForm;
