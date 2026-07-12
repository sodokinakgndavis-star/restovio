import type { SVGProps } from "react";

// lucide-react a retiré les icônes de marques (politique de licence) : ces
// glyphes sont reconstruits à partir de formes SVG simples, en `currentColor`.

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M14.5 8.5h-1.2c-.44 0-.8.36-.8.8V11h2l-.3 2h-1.7v6h-2v-6H9v-2h1.5V9.1c0-1.5 1-2.6 2.5-2.6h1.5v2Z"
        fill="white"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 3v10.8a2.7 2.7 0 1 1-2.2-2.66V8.6a5.3 5.3 0 1 0 4.7 5.27V9.9a6.6 6.6 0 0 0 3.9 1.26V8.6a3.9 3.9 0 0 1-2.4-.83A4 4 0 0 1 16.6 5V3H14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="currentColor" />
      <path d="M10.2 9.3v5.4l4.8-2.7-4.8-2.7Z" fill="var(--footer-icon-bg, white)" />
    </svg>
  );
}
