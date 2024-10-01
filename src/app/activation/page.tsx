"use client";

import { useState } from "react";
import WhatsappButton from "@/components/WhatsappSubmit";
import { buildWhatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COPIED_SIGN_WAIT = 2000;
/**
 *
 */
export default function AccountActivationPage() {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(`Copied: ${text}`);
      setTimeout(() => {
        setCopyStatus(null);
      }, COPIED_SIGN_WAIT); // Reset status after 2 seconds
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold text-blue-600">
          Activación de Cuenta
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Para activar su cuenta, por favor Yapee o Plinee{" "}
          <span className="font-bold">3 soles</span> al número{" "}
          <button
            className="cursor-pointer font-bold text-blue-600 underline"
            onClick={async () => handleCopyToClipboard("906 102 713")}
          >
            906 102 713
          </button>{" "}
          y envíe el pantallazo al número{" "}
          <button
            className="cursor-pointer text-blue-600 underline"
            onClick={async () => handleCopyToClipboard("+51 988 575 588")}
          >
            +51 988 575 588
          </button>{" "}
          por WhatsApp.
        </p>
        <p className="mb-6 text-center text-gray-700">
          Después de enviar el pantallazo, su cuenta se activará. Haga clic en
          &quot;Iniciarrquot; para empezar a jugar.
        </p>
        <div className="mb-4 flex justify-center">
          <Button
            variant="link"
            asChild
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
          >
            <Link href="/play">Iniciar</Link>
          </Button>
        </div>

        {/* Copy feedback */}
        {copyStatus !== null && (
          <div className="text-center font-medium text-green-600">
            {copyStatus}
          </div>
        )}
        <WhatsappButton
          onClick={() => {
            window.open(
              buildWhatsappLink(
                "+51 984724707",
                "Hola, he enviado el pantallazo para activar mi cuenta.",
              ),
            );
          }}
        >
          Enviar Pantallazo
        </WhatsappButton>
      </div>
    </div>
  );
}
