import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { getIndonesiaMap } from "@/lib/data/indonesia-map";

export const metadata: Metadata = {
  title: "Kontak — CoPublika",
  description: "Pertanyaan program, kolaborasi riset, atau tulisan tamu. Tim Admin CoPublika membalas dalam satu hari kerja.",
};

export default function Page() {
  return <ContactPage map={getIndonesiaMap()} />;
}
