import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./ui/button";

import Image from "next/image";

/**
 * @param props - The button props
 * @param props.children - The button content
 * @param props.className - The button class
 * @param props.rest - The rest of the button props
 * @returns The button component
 */
export const WhatsappButton = ({
  children,
  className,
  ...rest
}: ButtonProps) => (
  <Button
    {...rest}
    variant="link"
    className={cn("z-20 size-14 rounded-full bg-white", className)}
  >
    {children}
    <Image
      className="my-2"
      alt="whatsapp"
      src="/whatsapp/01_Glyph/01_Digital/03_PNG/Green/Digital_Glyph_Green.png"
      height={50}
      width={50}
    />
  </Button>
);
export default WhatsappButton;
