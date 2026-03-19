export const metadata = {
  title: "Guest area | The Wild Oasis",
};

export const dynamic = "force-dynamic";

import { auth } from "@/app/_lib/auth";

export default async function Page() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}
