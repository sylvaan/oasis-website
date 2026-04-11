"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { updateGuestProfile, type ActionState } from "@/app/_lib/actions";

interface Guest {
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}

export default function UpdateProfileForm({
  guest,
  children,
}: {
  guest: Guest;
  children: React.ReactNode;
}) {
  const { fullName, email, countryFlag, nationalID } = guest;

  const [state, formAction] = useActionState(
    (prevState: ActionState, formData: FormData) =>
      updateGuestProfile(prevState, formData),
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

      <div className="flex flex-col gap-2">
        <label>Full name</label>
        <input
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Email address</label>
        <input
          disabled
          defaultValue={email}
          name="email"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationality">Where are you from?</label>
          <div className="relative h-5 w-8">
            {countryFlag && (
              <Image
                src={countryFlag}
                alt="Country flag"
                fill
                className="rounded-sm object-cover"
              />
            )}
          </div>
        </div>

        {children}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="nationalID">National ID number</label>
          <p className="text-sm text-primary-400">6-16 characters, alphanumeric only</p>
        </div>
        <input
          name="nationalID"
          defaultValue={nationalID}
          minLength={6}
          maxLength={16}
          required
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
        />
      </div>

      <div className="flex justify-end items-center gap-6">
        <Button />
      </div>
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? "Updating..." : "Update profile"}
    </button>
  );
}
