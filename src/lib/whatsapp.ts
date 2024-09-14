import { env } from "@/env.mjs";

const chessstakeWhatsappNumber = env.NEXT_PUBLIC_CHESSSTAKE_PHONE.replaceAll(
  " ",
  "",
);

const baseUrl = "https://wa.me/";

/**
 * @returns - The whatsapp link with the message embedded
 */
export function buildWhatsappLink() {
  const message = "Hi, I am interested in Chessstake";

  return `${baseUrl}${chessstakeWhatsappNumber}?text=${encodeURIComponent(message)}`;
}
