/* eslint-disable @typescript-eslint/naming-convention */
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { vercel } from "@t3-oss/env-core/presets";

export const env = createEnv({
  extends: [vercel()],

  server: {
    DRIZZLE_DATABASE_URL: z.string().url(),

    AUTH_SECRET: z.string(),
    ESLINT_USE_FLAT_CONFIG: z.coerce.boolean(),
  },
  client: {
    NEXT_PUBLIC_PROJECT_NAME: z.string(),
    NEXT_PUBLIC_CHESSSTAKE_PHONE: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PROJECT_NAME: process.env["NEXT_PUBLIC_PROJECT_NAME"],
    NEXT_PUBLIC_CHESSSTAKE_PHONE: process.env["NEXT_PUBLIC_CHESSSTAKE_PHONE"],
    DRIZZLE_DATABASE_URL: process.env["DRIZZLE_DATABASE_URL"],
    ESLINT_USE_FLAT_CONFIG: process.env["ESLINT_USE_FLAT_CONFIG"],

    AUTH_SECRET: process.env["AUTH_SECRET"],
  },
  /*
   * For Next.js >= 13.4.4, you only need to destructure client variables:
   * Doing so throw typescript errors at the moment
   */
  emptyStringAsUndefined: false,
});
