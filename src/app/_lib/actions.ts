"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  getGuest,
  getSettings,
  updateBooking,
  updateGuest,
} from "./data-service";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuestProfile(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  const fullName = formData.get("fullName") as string;
  const nationalID = formData.get("nationalID") as string;
  const nationalityValue = formData.get("nationality") as string;

  if (!nationalityValue) throw new Error("Please provide your nationality");

  const [nationality, countryFlag] = nationalityValue.split("%");

  if (!/^[a-zA-Z0-9]{6,16}$/.test(nationalID)) {
    throw new Error("National ID must be between 6 and 16 characters (alphanumeric only)");
  }

  const updateData = { fullName, nationality, countryFlag, nationalID };

  const guestId = (session.user as { guestId?: number }).guestId as number;
  if (!guestId) throw new Error("Guest ID not found");

  await updateGuest(guestId, updateData);

  revalidatePath("/account/profile");
}

export async function deleteBookingAction(bookingId: number) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  const guestId = (session.user as { guestId?: number }).guestId as number;
  const guestBookings = await getBookings(guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  await deleteBooking(bookingId);

  revalidatePath("/account/reservations");
}

interface BookingData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
  hasBreakfast: boolean;
}

export async function updateBookingAction(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  const bookingId = Number(formData.get("bookingId"));

  const guestId = session.user.guestId;
  const guestBookings = await getBookings(guestId!);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: (formData.get("observations") as string).slice(0, 1000),
  };

  await updateBooking(bookingId, updateData);

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect("/account/reservations");
}

export async function createBookingAction(
  bookingData: BookingData,
  formData: FormData
) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  let guestId = session.user.guestId;

  // Fallback: If guestId is missing from session, fetch it manually
  if (!guestId && session.user.email) {
    const guest = await getGuest(session.user.email);
    if (guest) guestId = guest.id;
  }

  if (!guestId) {
    throw new Error(
      "Guest ID not found. Please log out and sign in again to sync your profile."
    );
  }

  const { breakfast_price } = await getSettings();
  const numGuests = Number(formData.get("numGuests"));
  const extrasPrice = bookingData.hasBreakfast
    ? breakfast_price * bookingData.numNights * numGuests
    : 0;

  const newBooking = {
    ...bookingData,
    guestId: guestId!,
    numGuests,
    observations: (formData.get("observations") as string)?.slice(0, 1000),
    extrasPrice,
    totalPrice: bookingData.cabinPrice + extrasPrice,
    isPaid: false,
    hasBreakfast: bookingData.hasBreakfast,
    status: "unconfirmed",
  };

  await createBooking(newBooking);

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}
