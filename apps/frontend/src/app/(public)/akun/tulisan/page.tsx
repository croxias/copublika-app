import type { Metadata } from "next";
import { WriterDesk } from "@/components/writer/WriterDesk";

export const metadata: Metadata = {
  title: "Ruang Penulis — CoPublika",
  description: "Tulis, ajukan, dan pantau naskah blog Anda. Tim editor CoPublika meninjau setiap naskah sebelum tayang.",
  robots: { index: false },
};

export default function WriterPage() {
  return <WriterDesk />;
}
