import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabaseClient";

/////////////
// GET

export async function getCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, max_capacity, regular_price, discount, image")
    .order("name");

  if (error) {
    console.error(error);
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

  // No need to throw here, we can handle it in the page
  return data;
}

export async function getCabinPrice(id: string) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regular_price, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

export async function getGuest(email: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Supabase error in getGuest:", error);
  }

  return data;
}

export async function createGuest(newGuest: {
  email: string;
  fullName: string;
}) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error("Supabase error in createGuest:", error);
    throw new Error("Guest could not be created");
  }

  return data;
}

/////////////
// CREATE / UPDATE / DELETE
// (Will be implemented in the Server Actions phase)

export async function updateGuest(id: number, updatedFields: object) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}
export async function getBookings(guestId: number) {
  const { data, error } = await supabase
    .from("bookings")
    // Use select with join to get cabin data
    .select("id, created_at, start_date, end_date, num_nights, num_guests, total_price, guest_id, cabin_id, cabins(name, image)")
    .eq("guest_id", guestId)
    .order("start_date");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabin_id", cabinId)
    .or(`start_date.gte.${todayISO},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be used in the date range picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.start_date),
        end: new Date(booking.end_date),
      });
    })
    .flat();

  return bookedDates;
}

/////////////
// CREATE / UPDATE / DELETE

export async function createBooking(newBooking: object) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object is returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

export async function updateBooking(id: number, updatedFields: object) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
