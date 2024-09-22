import Image from "next/image";

import ProfileForm from "./profileForm";

import { auth } from "@/auth";

/**
 *
 */
export default async function ProfilePage() {
  const userId = (await auth())?.user.id;

  if (userId === undefined) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-6 rounded-lg bg-white p-6 shadow-lg">
      {/* Logo */}
      <Image
        src="/images/logo.png"
        alt="chessstake"
        priority
        height={100}
        width={100}
        className="mx-auto"
      />

      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido a Chess Stake!
        </h1>
        <p className="mt-1 text-gray-600">
          ¿Listo para poner a prueba tus habilidades de ajedrez?
        </p>
      </div>
      <ProfileForm userId={userId} />
    </div>
  );
}
