"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  getCountries,
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

  const guestId = (session.user as { guestId?: number }).guestId as number;
  if (!guestId) throw new Error("Guest ID not found");

  const fullName = formData.get("fullName") as string;
  const nationalID = formData.get("nationalID") as string;
  const nationality = formData.get("nationality") as string;

  if (!nationality) throw new Error("Please provide your nationality");

  if (!/^[a-zA-Z0-9]{6,16}$/.test(nationalID)) {
    throw new Error("National ID must be between 6 and 16 characters (alphanumeric only)");
  }

  try {
    // Fetch flag from server to keep it clean
    const countries = await getCountries();
    const countryFlag = countries.find((c: { name: string; flag: string }) => c.name === nationality)?.flag;

    const updateData = { fullName, nationality, countryFlag, nationalID };

    await updateGuest(guestId, updateData);

    revalidatePath("/account/profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update profile" };
  }
}

export async function deleteBookingAction(bookingId: number) {
  try {
    const session = await auth();
    if (!session || !session.user) throw new Error("You must be logged in");

    const guestId = (session.user as { guestId?: number }).guestId as number;
    const guestBookings = await getBookings(guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
      throw new Error("You are not allowed to delete this booking");

    await deleteBooking(bookingId);

    revalidatePath("/account/reservations");
    return { success: true, message: "Booking deleted successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete booking" };
  }
}

interface BookingData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
  hasBreakfast: boolean;
  isEarlyCheckin: boolean;
}


export async function updateBookingAction(formData: FormData) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  const bookingId = Number(formData.get("bookingId"));
  const guestId = (session.user as { guestId?: number }).guestId;

  try {
    const guestBookings = await getBookings(guestId!);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
      throw new Error("You are not allowed to update this booking");

    const updateData = {
      numGuests: Number(formData.get("numGuests")),
      observations: (formData.get("observations") as string).slice(0, 1000),
      isEarlyCheckin: formData.get("isEarlyCheckin") === "on",
    };

    await updateBooking(bookingId, updateData);

    revalidatePath("/account/reservations");
    revalidatePath(`/account/reservations/edit/${bookingId}`);
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update booking" };
  }

  redirect("/account/reservations");
}

export async function createBookingAction(
  bookingData: BookingData,
  formData: FormData
) {
  const session = await auth();
  if (!session || !session.user) throw new Error("You must be logged in");

  let guestId = (session.user as { guestId?: number }).guestId;

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

  try {
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
      isEarlyCheckin: bookingData.isEarlyCheckin,
      status: "unconfirmed",
    };

    await createBooking(newBooking);

    revalidatePath(`/cabins/${bookingData.cabinId}`);
    revalidatePath("/account/reservations");
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create booking" };
  }

  redirect("/account/reservations");
}
