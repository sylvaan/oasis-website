"use client";

import { useFormStatus } from "react-dom";
import Image from "next/image";
import { updateGuestProfile } from "@/app/_lib/actions";

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

  return (
    <form
      action={updateGuestProfile}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="flex flex-col gap-2">
        <label>Full name</label>
        <input
          disabled
          defaultValue={fullName}
          name="fullName"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
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
            <Image
              src={countryFlag}
              alt="Country flag"
              fill
              className="rounded-sm object-cover"
            />
          </div>
        </div>

        {children}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="nationalID">National ID number</label>
        <input
          name="nationalID"
          defaultValue={nationalID}
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
