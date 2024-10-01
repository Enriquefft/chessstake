import { env } from "@/env.mjs";

/**
 *
 * @param number
 */
function formatPhoneNumber(number?: string) {
  if (number === undefined) return undefined;
  return number.replaceAll(" ", "");
}

const chessstakeWhatsappNumber = formatPhoneNumber(
  env.NEXT_PUBLIC_CHESSSTAKE_PHONE,
);

const baseUrl = "https://wa.me/";

/**
 * @param number
 * @param message
 * @returns - The whatsapp link with the message embedded
 */
export function buildWhatsappLink(
  number?: string,
  message = "Hi, I am interested in Chessstake",
) {
  return `${baseUrl}${formatPhoneNumber(number) ?? chessstakeWhatsappNumber}?text=${encodeURIComponent(message)}`;
}
