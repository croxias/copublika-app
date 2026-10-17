import { Fraunces } from "next/font/google";

// Brand serif. Used by the admin (italic accents in page titles) and the member card name.
// Variable font with the optical-size axis so large and small sizes both draw well.
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
