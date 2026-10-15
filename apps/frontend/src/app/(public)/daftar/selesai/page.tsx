import { OrderDone } from "@/components/program/OrderDone";

export const metadata = { title: "Pendaftaran diterima — CoPublika" };

export default function DaftarSelesaiPage() {
  return (
    <main className="cp-pg cp-reg-page">
      <OrderDone />
    </main>
  );
}
