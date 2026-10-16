import { redirect } from "next/navigation";

/** Friendly address for the navbar's "Pendaftaran"; the flow lives at /daftar. */
export default function PendaftaranPage() {
  redirect("/daftar");
}
