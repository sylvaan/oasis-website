import { getCabin, getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cabinId: string }> }
) {
  const { cabinId } = await params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);

    if (!cabin) {
      return Response.json({ message: "Cabin not found" }, { status: 404 });
    }

    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin could not be loaded" }, { status: 500 });
  }
}
