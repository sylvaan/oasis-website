import Link from "next/link";

function LoginMessage() {
  return (
    <div className="grid grid-cols-[1fr_2fr] h-full border border-primary-800">
      <div className="flex items-center justify-center bg-primary-900 px-8 py-12">
        <p className="text-center text-xl text-primary-200">
          Please{" "}
          <Link href="/login" className="underline text-accent-500">
            login
          </Link>{" "}
          to reserve this
          <br /> cabin right now
        </p>
      </div>
      <div className="bg-primary-800"></div>
    </div>
  );
}

export default LoginMessage;
