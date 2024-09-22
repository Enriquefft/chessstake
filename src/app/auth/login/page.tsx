import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { signIn, providerMap } from "@/auth";

/**
 *
 */
export default async function SignInPage() {
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

      {/* Sign-in Form */}
      <form
        className="flex w-full flex-col gap-4"
        action={async (formData) => {
          "use server";
          formData.set("redirectTo", "/");
          await signIn("resend", formData);
        }}
      >
        {/* Email Input */}
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Introduce tu correo"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Iniciar Sesión
        </Button>
      </form>

      {/* Social Sign-ins */}
      <div className="flex w-full flex-col gap-2">
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              await signIn(provider.id);
            }}
            className="w-full"
          >
            <Button
              type="submit"
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Iniciar sesión con {provider.name}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
