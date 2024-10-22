"use client";

import { buildWhatsappLink } from "@/lib/whatsapp";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { ErrorType } from "@/lib/utils";

const errorMessagesMap: Record<ErrorType, string> = {
  [ErrorType.PlayerNotFound]:
    "You are not logged in. Please log in to continue.",
  [ErrorType.PlayerNotActive]:
    "You are not authorized to play. Please ensure your account is active and up to date.",
  [ErrorType.PlayerCanOnlyPlayEvery24Hours]:
    "You have already played today. Please come back after 24 hours to play again.",
};

type ErrorPageProps =
  | { error: Error & { digest?: string }; type?: never; reset?: () => void }
  | { error?: never; type: ErrorType; reset?: () => void };

export default function ErrorPage({ error, type, reset }: ErrorPageProps) {
  const router = useRouter();
  const [friendlyMessage, setFriendlyMessage] = useState<string>(
    "An unexpected error occurred. Please try again or contact us.",
  );

  useEffect(() => {
    const message = type === undefined ? error.message : errorMessagesMap[type];
    setFriendlyMessage(message);
  }, [error, type]);

  const contactWhatsApp = () => {
    window.open(
      buildWhatsappLink(
        "51984724707",
        `Hola, he encontrado el siguiente error:\n "${friendlyMessage}".`,
      ),
      "_blank",
    );
  };

  return (
    // Nextjs internationalizes the html tag, so no need to add lang attribute
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-red-600">
            Oops, something went wrong!
          </h1>
          <p className="mb-6 text-gray-700">{friendlyMessage}</p>
          <div className="flex flex-col items-center space-y-4">
            <Button
              size="lg"
              className="w-full rounded bg-green-500 font-semibold text-white hover:bg-green-600"
              onClick={contactWhatsApp}
            >
              Contact us on WhatsApp
            </Button>
            {reset && (
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={reset}
              >
                Try Again
              </Button>
            )}
            <Button
              size="lg"
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => {
                router.push("/");
              }}
            >
              Go Back to Home
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
