// Custom flat-style line illustrations for the marketing site — matching
// the visual language of the reference screenshots without reproducing
// any real photography (which we don't have usable source files for).
// All accept a className so callers control size/color via currentColor.

export function LogoMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 5C24 5 11 21.5 11 30.5a13 13 0 0 0 26 0C37 21.5 24 5 24 5Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
      <path
        d="M16 27c1.8 4 4.6 6 8 6s6.2-2 8-6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepSelectIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="8" y="9" width="32" height="21" rx="2" stroke="currentColor" />
      <path d="M3 37h42l-3.5 5h-35L3 37Z" stroke="currentColor" />
      <path
        d="M17 17h7l2 7H16l1-7Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
      />
      <circle cx="19.5" cy="27" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="24.5" cy="27" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StepOrderIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="10" y="8" width="28" height="34" rx="3" stroke="currentColor" />
      <rect
        x="17"
        y="4"
        width="14"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
      />
      <path d="M15 24l5 5 12-12" stroke="currentColor" />
    </svg>
  );
}

export function StepDeliverIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 31V15a2 2 0 0 1 2-2h21a2 2 0 0 1 2 2v16" stroke="currentColor" />
      <path
        d="M29 21h8l6 6.5V31H29V21Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
      />
      <circle cx="14" cy="35" r="3.4" stroke="currentColor" />
      <circle cx="35" cy="35" r="3.4" stroke="currentColor" />
      <path d="M4 31h6.6M38.4 31h5.6M17.4 31h14.2" stroke="currentColor" />
    </svg>
  );
}

export function StepEnjoyIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect
        x="7"
        y="21"
        width="26"
        height="17"
        rx="2"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
      />
      <path d="M7 29.5h26M14.5 21v-3M20 21v-3M25.5 21v-3" stroke="currentColor" />
      <path
        d="M14.5 18a2.5 2.5 0 0 1 5 0M25.5 18a2.5 2.5 0 0 1 5-.3"
        stroke="currentColor"
      />
      <path
        d="M38 12c-3 2-3 5 0 7 3-2 3-5 0-7Z"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
      />
    </svg>
  );
}

export function DeliveryVanIllustration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M10 82V38a4 4 0 0 1 4-4h96a4 4 0 0 1 4 4v44"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M114 50h34l28 26v6h-62V50Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M142 50v20h30" stroke="currentColor" strokeWidth="3" />
      <circle cx="52" cy="88" r="11" fill="white" stroke="currentColor" strokeWidth="3" />
      <circle cx="52" cy="88" r="3.2" fill="currentColor" />
      <circle cx="148" cy="88" r="11" fill="white" stroke="currentColor" strokeWidth="3" />
      <circle cx="148" cy="88" r="3.2" fill="currentColor" />
      <path
        d="M10 82H2M176 82h14M63 82h74"
        stroke="currentColor"
        strokeWidth="3"
      />
      <rect
        x="26"
        y="48"
        width="30"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M26 57h30" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
