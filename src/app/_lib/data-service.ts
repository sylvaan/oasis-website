import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabaseClient";
import { supabaseAdmin } from "./supabaseAdmin";

/////////////
// GET

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, max_capacity, regular_price, discount, image")
    .order("name");

  if (error) {
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function getCabin(id: string) {
  const { data } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regular_price, discount")
    .eq("id", id)
    .single();

  if (error) {
    // Silent error for price fetching
  }

  return data;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    throw new Error("Settings could not be loaded");
  }

  // settings table uses camelCase: minBookingLength, maxBookingLength, etc.
  return {
    min_booking_length: data.minBookingLength,
    max_booking_length: data.maxBookingLength,
    max_guests_per_booking: data.maxGuestsPerBooking,
    breakfast_price: data.breakfastPrice,
  };
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getGuest(email: string) {
  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Supabase error in getGuest:", error.message);
  }

  return data;
}

export async function createGuest(newGuest: {
  email: string;
  fullName: string;
}) {
  const { data, error } = await supabaseAdmin.from("guests").insert([newGuest]);

  if (error) {
    console.error("Supabase error in createGuest:", error.message);
    throw new Error("Guest could not be created");
  }

  return data;
}

/////////////
// CREATE / UPDATE / DELETE

export async function updateGuest(id: number, updatedFields: Record<string, unknown>) {

  const { data, error } = await supabaseAdmin
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }
  return data;
}

import { type Booking } from "../_components/ReservationList";

export async function getBookings(guestId: number): Promise<Booking[]> {
  if (!guestId) return [];

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  const bookings = (data as unknown as Record<string, unknown>[])?.map((booking) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b = booking as any;
    return {
      ...b,
      cabins: Array.isArray(b.cabins)
        ? b.cabins[0]
        : (b.cabins as { name: string; image: string }),
    };
  }) as unknown as Booking[];

  return bookings;




}

export async function getBooking(id: number) {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayISO},status.eq.checked-in`);

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

/////////////
// CREATE / UPDATE / DELETE

export async function createBooking(newBooking: Record<string, unknown>) {

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be created");
  }

  return data;
}

export async function updateBooking(id: number, updatedFields: Record<string, unknown>) {

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabaseAdmin.from("bookings").delete().eq("id", id);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  return data;
}
