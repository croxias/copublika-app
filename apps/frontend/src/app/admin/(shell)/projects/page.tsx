'use client';

import { CollectionManager } from '@/components/admin/cms/CollectionManager';
import { ClusterManager } from '@/components/admin/cms/ClusterManager';
import { projectsConfig } from '@/lib/cms/config/projects';

export default function ProjectsPage() {
  return (
    <CollectionManager
      config={projectsConfig}
      crumb={['Riset', 'Riset & Proyek']}
      title="Riset &"
      accent="Proyek"
      description="Proyek riset di galeri /research. Hanya status Tampil yang muncul. Metodologi di kartu di-blur untuk tamu, dan halaman detail proyek hanya untuk anggota yang sudah login."
      publicHref="/research"
      headerActions={<ClusterManager />}
    />
  );
}
