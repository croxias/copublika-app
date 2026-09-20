'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table';
import { AlertCircle, BadgeCheck, Building2, CalendarDays, CheckCircle2, Clock3, Eye, Mail, Phone, Search, ShieldCheck, UserRound } from 'lucide-react';

import { useStaging, type StagingApplicant } from '@/lib/staging';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge-2';
import { Button } from '@/components/ui/button-1';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataGrid, DataGridColumnHeader, DataGridContainer, DataGridPagination, DataGridTable } from '@/components/ui/data-grid-table';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type StatusFilter = 'all' | StagingApplicant['status'];
type ApplicantTab = 'all' | 'pending' | 'verified' | 'rejected';
type Decision = 'verified' | 'rejected';

const statusLabels: Record<StagingApplicant['status'], string> = {
  pending: 'Menunggu',
  verified: 'Disetujui',
  rejected: 'Ditolak',
  archived: 'Diarsipkan',
};


const kpiFilters: { key: StatusFilter; label: string; icon: typeof UserRound }[] = [
  { key: 'all', label: 'Total pendaftar', icon: UserRound },
  { key: 'pending', label: 'Menunggu verifikasi', icon: Clock3 },
  { key: 'verified', label: 'Disetujui', icon: CheckCircle2 },
  { key: 'rejected', label: 'Ditolak', icon: AlertCircle },
];

function StatusBadge({ status }: { status: StagingApplicant['status'] }) {
  const variant =
    status === 'verified' ? 'success' : status === 'rejected' ? 'destructive' : status === 'archived' ? 'secondary' : 'warning';
  return (
    <Badge variant={variant} appearance="outline" size="sm">
      {statusLabels[status]}
    </Badge>
  );
}


function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

export default function ApplicantsRevamp() {
  const store = useStaging();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeTab, setActiveTab] = useState<ApplicantTab>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<StagingApplicant | null>(null);
  const [confirmDecision, setConfirmDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'submittedAt', desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const data = useMemo(
    () =>
      store.applicants.filter((applicant) => {
        const matchStatus = statusFilter === 'all' || applicant.status === statusFilter;
        const matchTab = activeTab === 'all' || applicant.status === activeTab;
        const haystack = `${applicant.name} ${applicant.institution} ${applicant.programStudy} ${applicant.expertise}`.toLowerCase();
        return matchStatus && matchTab && (!query || haystack.includes(query.toLowerCase()));
      }),
    [store.applicants, statusFilter, activeTab, query],
  );

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return store.applicants.filter((applicant) => applicant.submittedAt === today).length;
  }, [store.applicants]);

  const countByStatus = (key: StatusFilter) =>
    key === 'all' ? store.applicants.length : store.applicants.filter((applicant) => applicant.status === key).length;

  const columns = useMemo<ColumnDef<StagingApplicant>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Pendaftar" className="font-bold text-background" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-brand-soft text-[11px] font-semibold text-brand-strong">
                {initials(row.original.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-0.5">
              <div className="truncate font-semibold text-foreground">{row.original.name}</div>
            </div>
          </div>
        ),
        size: 210,
        enableHiding: false,
        meta: { headerTitle: 'Pendaftar', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-9 w-52" /> },
      },
      {
        accessorKey: 'institution',
        id: 'institution',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Institusi" className="font-bold text-background" />,
        cell: ({ row }) => <div className="truncate font-semibold text-foreground">{row.original.institution}</div>,
        size: 180,
        meta: { headerTitle: 'Institusi', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-4 w-32" /> },
      },
      {
        accessorKey: 'programStudy',
        id: 'programStudy',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Prodi" className="font-bold text-background" />,
        cell: ({ row }) => <div className="truncate font-semibold text-foreground">{row.original.programStudy}</div>,
        size: 180,
        meta: { headerTitle: 'Prodi', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-4 w-32" /> },
      },
      {
        accessorKey: 'category',
        id: 'category',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Kategori" className="font-bold text-background" />,
        cell: ({ row }) => <Badge variant="secondary" appearance="outline" size="sm">{row.original.category}</Badge>,
        size: 140,
        meta: { headerTitle: 'Kategori', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-5 w-24" /> },
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" className="font-bold text-background" />,
        cell: ({ row }) => <span className="font-semibold"><StatusBadge status={row.original.status} /></span>,
        size: 110,
        meta: { headerTitle: 'Status', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-5 w-20" /> },
      },
      {
        accessorKey: 'submittedAt',
        id: 'submittedAt',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Diajukan" className="font-bold text-background" />,
        cell: ({ row }) => <span className="font-mono text-xs font-semibold text-foreground/65">{row.original.submittedAt}</span>,
        size: 100,
        meta: { headerTitle: 'Diajukan', headerClassName: 'text-background font-bold', skeleton: <Skeleton className="h-4 w-20" /> },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected(row.original);
              setReason('');
              setReasonError('');
            }}
          >
            <Eye />
            Preview
          </Button>
        ),
        size: 92,
        enableSorting: false,
        enableHiding: false,
        meta: { headerTitle: 'Aksi', cellClassName: 'text-right', skeleton: <Skeleton className="h-7 w-20" /> },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data,
    pageCount: Math.max(1, Math.ceil(data.length / pagination.pageSize)),
    getRowId: (row) => row.id,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 4200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const decide = (status: Decision) => {
    if (!selected) return;
    if (status === 'rejected' && !reason.trim()) {
      setReasonError('Alasan penolakan wajib diisi untuk jejak audit.');
      return;
    }
    try {
      const memberId = status === 'verified' ? selected.memberId || `MEM-${new Date().getFullYear()}-${selected.id.replace(/\D/g, '').padStart(5, '0')}` : selected.memberId;
      store.updateApplicant(selected.id, {
        status,
        verificationState: status === 'verified' ? 'matched' : selected.verificationState,
        verificationNote: status === 'verified' ? 'Profil Google Scholar diperiksa Admin.' : selected.verificationNote,
        decisionReason: status === 'rejected' ? reason.trim() : undefined,
        reviewedAt: new Date().toISOString(),
        verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        memberId,
        audit: [...selected.audit, { action: status === 'verified' ? 'Approved' : 'Rejected', detail: status === 'verified' ? 'Disetujui dari dialog pratinjau kurasi.' : reason.trim(), at: new Date().toISOString() }],
      });
      setSelected(null);
      setConfirmDecision(null);
      setReason('');
      setReasonError('');
      setFeedback({ tone: 'success', message: status === 'verified' ? `Pendaftar berhasil disetujui. ID Member: ${memberId}` : 'Pendaftar berhasil ditolak.' });
    } catch {
      setConfirmDecision(null);
      setFeedback({ tone: 'error', message: 'Keputusan gagal disimpan. Silakan coba lagi.' });
    }
  };

  return (
    <main className="mx-auto w-full max-w-[1480px] px-[clamp(1rem,2.5vw,2.75rem)] pt-8 pb-16">
      <header className="flex flex-col gap-6 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="font-mono text-[10px] tracking-[0.14em] text-brand">KURASI / PENDAFTAR</span>
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-none font-bold tracking-[-0.055em] text-foreground">
            Verifikasi <span className="text-brand">pendaftar.</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Periksa profil Google Scholar dan identitas akademik pendaftar, lalu ambil keputusan dengan jejak audit yang tercatat.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-foreground bg-foreground px-4 py-3.5 text-background shadow-[0_14px_34px_-22px_rgba(0,0,0,0.6)]">
        <span className="grid size-10 place-items-center rounded-xl bg-brand text-brand-foreground"><ShieldCheck className="size-5" /></span>
          <div className="space-y-0.5">
            <div className="font-mono text-[10px] font-bold tracking-[0.08em] text-background/65 uppercase">Prioritas kurasi hari ini</div>
            <div className="text-sm font-bold text-background">{countByStatus('pending')} pendaftar menunggu</div>
          </div>
        </div>
      </header>

      <section aria-label="Ringkasan pendaftar" className="my-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiFilters.map(({ key, label, icon: Icon }) => {
          const active = statusFilter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setStatusFilter(key);
                if (key !== 'archived') setActiveTab(key);
                setPagination((state) => ({ ...state, pageIndex: 0 }));
              }}
              className={cn(
                'group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all duration-200',
                'hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_18px_38px_-26px_rgba(0,0,0,0.32)]',
                'focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none',
                active ? 'border-brand/60 shadow-[0_16px_34px_-26px_color-mix(in_srgb,var(--scopus)_60%,transparent)]' : 'border-border',
              )}
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-1 bg-brand opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3.5">
                <span
                  className={cn(
                    'grid size-11 place-items-center rounded-xl border transition-colors',
                    key === 'pending' && 'border-warning/25 bg-warning-soft text-warning-accent',
                    key === 'verified' && 'border-success/25 bg-success-soft text-success-accent',
                    key === 'rejected' && 'border-destructive/25 bg-destructive-soft text-destructive',
                    key === 'all' && 'border-foreground/15 bg-foreground/[0.06] text-foreground',
                    active && 'border-foreground bg-foreground text-background',
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold tracking-[0.05em] text-foreground uppercase">
                    {label}
                  </div>
                  <div className="font-mono text-[1.75rem] leading-none font-bold tracking-[-0.06em] text-foreground">
                    {countByStatus(key)}
                  </div>
                  {key === 'all' && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-foreground/65">
                      <span>{todayCount} pendaftar hari ini</span>
                      <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
                        {[3, 6, 4, 8, 5, 9].map((height, index) => <span key={index} className="w-1 rounded-t-sm bg-brand/70" style={{ height: `${height}px` }} />)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <div className="relative mb-6 flex flex-wrap items-center gap-2 border-b border-border" role="tablist" aria-label="Kelompok status pendaftar">
        {([
          ['all', 'Semua pendaftar', store.applicants.length],
          ['pending', 'Menunggu', countByStatus('pending')],
          ['verified', 'Approved', countByStatus('verified')],
          ['rejected', 'Rejected', countByStatus('rejected')],
        ] as const).map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => {
              setActiveTab(key);
              setStatusFilter(key);
              setPagination((state) => ({ ...state, pageIndex: 0 }));
            }}
            className={cn(
              'relative inline-flex items-center gap-2 px-3 py-3 text-[0.8125rem] font-semibold text-foreground/55 transition-colors duration-200 hover:text-foreground',
              activeTab === key && 'text-foreground',
            )}
          >
            {label}
            <span className={cn('rounded-full bg-foreground/8 px-2 py-0.5 font-mono text-[10px] text-foreground/60', activeTab === key && 'bg-brand-soft text-brand-strong')}>
              {count}
            </span>
            <span className={cn('absolute inset-x-2 bottom-[-1px] h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300', activeTab === key && 'scale-x-100')} />
          </button>
        ))}
      </div>

      <DataGrid
        table={table}
        recordCount={data.length}
        emptyMessage="Pendaftar tidak ditemukan. Coba ubah kata kunci atau filter."
        tableLayout={{ headerSticky: true, rowBorder: true, columnsVisibility: true, width: 'fixed', dense: false }}
        tableClassNames={{ edgeCell: 'px-2', headerRow: 'bg-foreground', bodyRow: 'transition-colors duration-200 hover:bg-brand-soft/30' }}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_58px_-42px_rgba(15,23,42,0.45)]">
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-background p-4">
            <label className="relative flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-foreground/20 bg-[#fffdf9] px-3 transition-[border-color,box-shadow] duration-200 focus-within:border-foreground focus-within:ring-[3px] focus-within:ring-foreground/10 md:max-w-md">
              <Search className="size-4 shrink-0 text-foreground/70" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPagination((state) => ({ ...state, pageIndex: 0 }));
                }}
                placeholder="Cari nama, institusi, atau prodi..."
                aria-label="Cari pendaftar"
                className="h-full w-full bg-transparent text-[0.8125rem] font-medium text-foreground outline-none placeholder:text-foreground/45"
              />
            </label>
            {activeTab === 'all' && <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setActiveTab(value === 'archived' ? 'all' : (value as ApplicantTab));
                setPagination((state) => ({ ...state, pageIndex: 0 }));
              }}
            >
              <SelectTrigger size="lg" className="w-auto min-w-[170px] border-foreground/20 bg-[#fffdf9]" aria-label="Filter status">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="verified">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="archived">Diarsipkan</SelectItem>
              </SelectContent>
            </Select>}
            <span className="ms-auto font-mono text-[11px] text-muted-foreground">{data.length} hasil</span>
          </div>

          <DataGridContainer border={false} className="overflow-visible">
              <DataGridTable />
          </DataGridContainer>

          <div className="border-t border-border bg-foreground px-4 py-3 text-background">
            <DataGridPagination sizes={[10, 25, 50]} sizesLabel="Baris" info="{from}–{to} dari {count} pendaftar" className="text-background [&_.text-muted-foreground]:!text-background/80 [&_button]:!text-background [&_button:hover]:!bg-background/15 [&_button[aria-current=page]]:!border [&_button[aria-current=page]]:!border-background [&_button[aria-current=page]]:!bg-background/15 [&_button[aria-current=page]]:!text-background [&_[data-slot=select-trigger]]:!border-background/30 [&_[data-slot=select-trigger]]:!bg-background/10 [&_[data-slot=select-trigger]]:!text-background [&_svg]:!text-background" />
          </div>
        </div>
      </DataGrid>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setReason('');
            setReasonError('');
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-1.5rem)] max-w-3xl gap-0 overflow-y-auto overflow-x-hidden border-foreground/15 p-0 shadow-[0_30px_90px_-34px_rgba(0,0,0,0.5)]">
          {selected && (
            <>
              <DialogHeader className="relative overflow-hidden border-b border-border bg-foreground/[0.025] p-5 sm:p-7">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand" />
                <div className="mb-5 space-y-1.5">
                  <span className="inline-flex items-center rounded-md bg-brand px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-brand-foreground shadow-sm">PRATINJAU PENDAFTAR</span>
                  <div className="text-sm font-semibold text-foreground">Identitas akademik</div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className="size-16 border-4 border-background shadow-sm">
                    <AvatarFallback className="bg-foreground text-sm font-semibold text-background">
                      {initials(selected.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2">
                      <span className="font-mono text-[10px] font-bold tracking-[0.08em] text-brand uppercase">Nama :</span>
                      <DialogTitle className="truncate text-xl tracking-[-0.03em]">{selected.name}</DialogTitle>
                    </div>
                    <div className="space-y-1.5 text-xs text-foreground/70">
                      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2"><span className="inline-flex items-center gap-1.5 font-semibold text-foreground"><Mail className="size-3.5 shrink-0 text-brand" />Email :</span><span className="truncate">{selected.email}</span></div>
                      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2"><span className="inline-flex items-center gap-1.5 font-semibold text-foreground"><Phone className="size-3.5 shrink-0 text-brand" />No. phone :</span><span>{selected.phone}</span></div>
                    </div>
                  </div>
                  <div className="ms-auto hidden sm:block">
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-4">
                {[
                  { label: 'Institusi', value: selected.institution, icon: Building2 },
                  { label: 'Prodi', value: selected.programStudy, icon: UserRound },
                  { label: 'Kategori', value: selected.category, icon: BadgeCheck },
                  { label: 'Diajukan', value: selected.submittedAt, icon: CalendarDays },
                ].map((item) => (
                  <div key={item.label} className="space-y-2 bg-card px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.05em] text-brand uppercase">
                      <item.icon className="size-3.5" />{item.label}
                    </div>
                    <div className="truncate text-[13px] font-semibold text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mx-5 mt-5 rounded-xl border border-brand/25 bg-brand-soft/50 p-4 sm:mx-7">
                <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.08em] text-brand-strong uppercase">
                  <BadgeCheck className="size-4" /> Profil Google Scholar
                </div>
                <a
                  href={selected.scholarUrl || `https://scholar.google.com/citations?user=${selected.scholarId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border border-brand/25 bg-background px-3 py-2.5 text-xs font-semibold text-brand-strong transition-colors hover:border-brand hover:bg-white"
                >
                  <span className="min-w-0 break-all font-mono">{selected.scholarUrl || 'Buka profil Google Scholar'}</span>
                  <Eye className="size-4 shrink-0" />
                </a>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand-strong"><ShieldCheck className="size-4" /></span>
                      Pemeriksaan Google Scholar
                    </div>
                    <Badge variant="secondary" appearance="light" size="sm">{selected.verificationState === 'matched' ? 'Terverifikasi' : selected.verificationState === 'manual_review' ? 'Perlu tinjauan' : 'Verifikasi admin'}</Badge>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Admin memeriksa profil Google Scholar sebagai sumber identitas akademik, lalu mencatat hasil pemeriksaan sebelum mengambil keputusan.</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="applicant-reason" className="flex items-baseline gap-2 text-[13px] font-semibold">
                    Catatan keputusan
                    <span className="text-[10px] font-normal text-muted-foreground">wajib untuk penolakan</span>
                  </label>
                  <textarea
                    id="applicant-reason"
                    rows={3}
                    value={reason}
                    onChange={(event) => {
                      setReason(event.target.value);
                      setReasonError('');
                    }}
                    placeholder="Tuliskan alasan atau catatan kurasi..."
                    aria-invalid={Boolean(reasonError)}
                    aria-describedby={reasonError ? 'applicant-reason-error' : undefined}
                    className="w-full resize-y rounded-lg border border-input bg-background p-3 text-[13px] text-foreground outline-none focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-ring/25"
                  />
                  {reasonError && (
                    <p id="applicant-reason-error" role="alert" className="text-[11px] font-medium text-destructive">
                      {reasonError}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-col-reverse gap-2 border-t border-border bg-foreground/[0.02] p-4 sm:flex-row sm:justify-between sm:p-5">
                <Button variant="outline" className="w-full border-foreground/25 bg-background font-semibold text-foreground sm:w-auto" onClick={() => setSelected(null)}>
                  Batal
                </Button>
                <div className="flex w-full gap-2 sm:w-auto">
                <Button variant="destructive" className="flex-1 sm:flex-none" onClick={() => setConfirmDecision('rejected')} disabled={selected.status === 'rejected'}>
                  Tolak
                </Button>
                <Button className="flex-1 bg-success text-success-foreground hover:bg-success/90 sm:flex-none" onClick={() => setConfirmDecision('verified')} disabled={selected.status === 'verified'}>
                  Setujui pendaftar
                </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(confirmDecision)} onOpenChange={(open) => !open && setConfirmDecision(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmDecision === 'verified' ? 'Setujui pendaftar?' : 'Tolak pendaftar?'}</DialogTitle>
            <DialogDescription>
              {confirmDecision === 'verified' ? 'Pendaftar akan ditandai disetujui dan hasil verifikasi Admin dicatat di audit.' : 'Pendaftar akan ditandai ditolak. Pastikan catatan keputusan sudah benar.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDecision(null)}>Batal</Button>
            <Button variant={confirmDecision === 'verified' ? 'primary' : 'destructive'} onClick={() => confirmDecision && decide(confirmDecision)}>
              {confirmDecision === 'verified' ? 'Ya, setujui' : 'Ya, tolak'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {feedback && (
        <div role="status" aria-live="polite" className={cn('fixed right-4 bottom-4 z-[70] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg', feedback.tone === 'success' ? 'border-success/30 bg-success-soft text-success-accent' : 'border-destructive/30 bg-destructive-soft text-destructive')}>
          {feedback.tone === 'success' ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertCircle className="mt-0.5 size-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}
    </main>
  );
}
