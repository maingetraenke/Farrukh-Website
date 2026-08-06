"use client";

import { useEffect } from "react";

// Catches errors thrown by the root layout itself (which the regular
// error.tsx cannot, since it renders inside that layout). Deliberately
// plain — this must render its own <html>/<body> and cannot rely on the
// design system, since the root layout that provides it may be why this
// is rendering.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="de">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem" }}>
        <h1>Etwas ist schiefgelaufen</h1>
        <p>Bitte lade die Seite neu oder wende dich an die Administration.</p>
        <button onClick={reset} style={{ marginTop: "1rem" }}>
          Erneut versuchen
        </button>
      </body>
    </html>
  );
}
