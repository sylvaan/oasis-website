import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10 transition-transform hover:scale-105">
      <Image 
        src="/logo.png" 
        height="60" 
        width="60" 
        alt="The Wild Oasis logo" 
        quality={100}
      />
      <span className="text-xl font-semibold text-primary-100 uppercase tracking-widest">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
