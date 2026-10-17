import { redirect } from 'next/navigation';

// Manajemen Batch was replaced by Kuota & Kapasitas, which reads the seats where they are set.
export default function BatchesPage() {
  redirect('/admin/capacity');
}
