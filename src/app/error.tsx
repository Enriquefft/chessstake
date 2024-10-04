"use client";

import Error from "@/components/error";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps) => (
  <Error error={error} reset={reset} />
);

export default GlobalError;
