"use client";

import { usePublicProgramPrices } from "@/lib/cms/registration-settings";
import { formatRupiah, type ProgramKey } from "@/lib/data/programs";

/** A program's price as set in the admin ("Harga & kursi" / "Harga & angkatan"), for server-rendered pages. */
export function ProgramPrice({ program }: { program: ProgramKey }) {
  const prices = usePublicProgramPrices();
  return <>{formatRupiah(prices[program].price)}</>;
}
