import { SignIn } from "@/components/sign-in";
import Image from "next/image";

/**
 * @returns Login page component
 */
export default function SignInPage() {
  return (
    <div>
      <Image
        src="/logo.png"
        alt="chessstake"
        priority
        height={80}
        width={120}
      />
      <SignIn />
    </div>
  );
}
