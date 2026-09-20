'use client';

import { useCallback, useMemo, useState } from 'react';
import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef, type PaginationState } from '@tanstack/react-table';
import {
  Archive,
  CalendarClock,
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  Eye,
  FileText,
  Layers3,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useStaging } from '@/lib/staging';
import { BatchPurpose, StagingBatch, BatchStatus } from '@/lib/staging';
import { Badge } from '@/components/ui/badge-2';
import { Button as DsButton } from '@/components/ui/button-1';
import { Card, CardContent } from '@/components/ui/Card';
import { DataGrid, DataGridColumnHeader, DataGridContainer, DataGridPagination, DataGridTable } from '@/components/ui/data-grid-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Input, Textarea, Label, Progress } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Soft-lock: Batch khusus Join Member — program/event punya lifecycle & kuota sendiri
const BATCH_MEMBERSHIP_PURPOSE: BatchPurpose = 'Join Member';
const statusMeta: Record<BatchStatus, { label: string; action: string; desc: string }> = {
  Draft: { label: 'Draft', action: 'Buka pendaftaran', desc: 'Batch akan dibuka dan pendaftar dapat mendaftar.' },
  Open: { label: 'Terbuka', action: 'Tutup pendaftaran', desc: 'Pendaftaran akan ditutup. Pendaftar baru tidak dapat masuk.' },
  Closed: { label: 'Ditutup', action: 'Arsipkan batch', desc: 'Batch akan diarsipkan dan tidak lagi aktif.' },
  Archived: { label: 'Arsip', action: 'Pulihkan ke draft', desc: 'Batch akan dikembalikan ke status Draft.' },
};
const nextStatus: Record<BatchStatus, BatchStatus> = { Draft: 'Open', Open: 'Closed', Closed: 'Archived', Archived: 'Draft' };
type FilterKey = 'all' | 'ongoing' | BatchStatus;
const statusTabs: ReadonlyArray<readonly [FilterKey, string]> = [
  ['all', 'Semua batch'],
  ['ongoing', 'Ongoing'],
  ['Open', 'Terbuka'],
  ['Draft', 'Draft'],
  ['Closed', 'Ditutup'],
  ['Archived', 'Arsip'],
];
type FormState = { name: string; purpose: BatchPurpose; quota: string; startDate: string; deadline: string; description: string; status: 'Draft' | 'Open' };
const emptyForm: FormState = { name: '', purpose: 'Join Member', quota: '60', startDate: '', deadline: '', description: '', status: 'Draft' };

function formatDate(value?: string) {
  if (!value) return 'Belum ditentukan';
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}
function dateAtStart(value: string) {
  return new Date(`${value}T00:00:00`);
}
function isOngoing(batch: StagingBatch) {
  if (batch.status !== 'Open' || !batch.startDate || !batch.deadline) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const openingWindow = dateAtStart(batch.startDate);
  openingWindow.setDate(openingWindow.getDate() - 1);
  const closing = dateAtStart(batch.deadline);
  return today >= openingWindow && today <= closing;
}
function occupancy(batch: StagingBatch, applicants: number) {
  return Math.min(100, Math.round((applicants / Math.max(1, batch.quota)) * 100));
}
function purposeOf(batch: StagingBatch): BatchPurpose {
  return batch.purpose ?? 'Join Member';
}

export default function BatchManagementPage() {
  const store = useStaging();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<StagingBatch | null>(null);
  const [pendingTransition, setPendingTransition] = useState<StagingBatch | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const filtered = useMemo(
    () =>
      store.batches.filter((batch) => {
        const matchesQuery = `${batch.name} ${batch.description} ${purposeOf(batch)}`.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === 'all' ? true : filter === 'ongoing' ? isOngoing(batch) : batch.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [store.batches, query, filter],
  );
  const selected = store.batches.find((batch) => batch.id === selectedId) ?? null;
  const applicantCount = useCallback((batchId: string) => store.applicants.filter((applicant) => applicant.batchId === batchId).length, [store.applicants]);
  const openCount = store.batches.filter((batch) => batch.status === 'Open').length;
  const closedCount = store.batches.filter((batch) => batch.status === 'Closed').length;
  const ongoingCount = store.batches.filter(isOngoing).length;

  const resetPage = () => setPagination((state) => ({ ...state, pageIndex: 0 }));
  const selectFilter = (value: FilterKey) => {
    setFilter(value);
    resetPage();
  };

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setFormOpen(true);
  }
  function openEdit(batch: StagingBatch) {
    setEditingId(batch.id);
    setForm({
      name: batch.name,
      purpose: purposeOf(batch),
      quota: String(batch.quota),
      startDate: batch.startDate ?? '',
      deadline: batch.deadline,
      description: batch.description,
      status: batch.status === 'Open' ? 'Open' : 'Draft',
    });
    setFormError('');
    setFormOpen(true);
  }
  function openDetail(batch: StagingBatch) {
    setSelectedId(batch.id);
    setDetailOpen(true);
  }
  function saveBatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quota = Number(form.quota);
    if (!form.name.trim()) return setFormError('Nama batch wajib diisi.');
    if (!Number.isInteger(quota) || quota < 1) return setFormError('Kapasitas peserta harus berupa bilangan positif.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.startDate)) return setFormError('Jadwal buka wajib diisi dengan tanggal yang valid.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) return setFormError('Jadwal tutup wajib diisi dengan tanggal yang valid.');
    if (dateAtStart(form.deadline) < dateAtStart(form.startDate)) return setFormError('Jadwal tutup tidak boleh lebih awal dari jadwal buka.');
    const value = { name: form.name.trim(), purpose: BATCH_MEMBERSHIP_PURPOSE, quota, startDate: form.startDate, deadline: form.deadline, description: form.description.trim(), status: form.status as BatchStatus };
    if (editingId) store.updateBatch(editingId, value);
    else store.addBatch(value);
    setFormOpen(false);
  }
  function confirmTransition() {
    if (!pendingTransition) return;
    store.updateBatch(pendingTransition.id, { status: nextStatus[pendingTransition.status] });
    setSelectedId(pendingTransition.id);
    setPendingTransition(null);
  }
  const archiveBatch = useCallback((batch: StagingBatch) => setPendingTransition(batch), []);
  function confirmDelete() {
    if (!deleteTarget) return;
    if (applicantCount(deleteTarget.id) > 0) return;
    store.removeBatch(deleteTarget.id);
    if (selectedId === deleteTarget.id) {
      setDetailOpen(false);
      setSelectedId(null);
    }
    setDeleteTarget(null);
  }
  function archiveFromDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    setPendingTransition(target);
  }

  const columns = useMemo<ColumnDef<StagingBatch>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader column={column} title="Batch" className="font-bold text-background" />,
        cell: ({ row }) => (
          <div className="batch-name-cell">
            <span className="batch-name-title">{row.original.name}</span>
            <div className="batch-name-meta">
              <small>{row.original.id}</small>
              {isOngoing(row.original) && (
                <Badge variant="warning" appearance="light" size="sm">
                  Ongoing
                </Badge>
              )}
            </div>
          </div>
        ),
        size: 260,
        meta: { headerTitle: 'Batch', headerClassName: 'text-background font-bold' },
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        header: ({ column }) => <DataGridColumnHeader column={column} title="Status" className="font-bold text-background" />,
        cell: ({ row }) => {
          const meta = statusMeta[row.original.status];
          const variant = row.original.status === 'Open' ? 'success' : row.original.status === 'Closed' ? 'destructive' : 'secondary';
          return (
            <Badge variant={variant} appearance="outline" size="sm">
              {meta.label}
            </Badge>
          );
        },
        size: 110,
        meta: { headerTitle: 'Status', headerClassName: 'text-background font-bold' },
      },
      {
        accessorKey: 'startDate',
        enableSorting: false,
        header: ({ column }) => <DataGridColumnHeader column={column} title="Jadwal buka" className="font-bold text-background" />,
        cell: ({ row }) => <span className="batch-schedule">{formatDate(row.original.startDate)}</span>,
        size: 130,
        meta: { headerTitle: 'Jadwal buka', headerClassName: 'text-background font-bold' },
      },
      {
        accessorKey: 'deadline',
        enableSorting: false,
        header: ({ column }) => <DataGridColumnHeader column={column} title="Jadwal tutup" className="font-bold text-background" />,
        cell: ({ row }) => <span className="batch-schedule">{formatDate(row.original.deadline)}</span>,
        size: 130,
        meta: { headerTitle: 'Jadwal tutup', headerClassName: 'text-background font-bold' },
      },
      {
        id: 'capacity',
        enableSorting: false,
        header: ({ column }) => <DataGridColumnHeader column={column} title="Kapasitas" className="font-bold text-background" />,
        accessorFn: (row) => applicantCount(row.id),
        cell: ({ row }) => {
          const count = applicantCount(row.original.id);
          return (
            <div className="batch-capacity-cell">
              <b>
                {count}/{row.original.quota}
              </b>
              <Progress value={occupancy(row.original, count)} />
            </div>
          );
        },
        size: 130,
        meta: { headerTitle: 'Kapasitas', headerClassName: 'text-background font-bold' },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Aksi" className="font-bold text-background" />
        ),
        enableSorting: false,
        size: 64,
        cell: ({ row }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <DsButton
                type="button"
                variant="ghost"
                size="sm"
                mode="icon"
                aria-label={`Aksi untuk ${row.original.name}`}
                className="batch-action-trigger mx-auto flex"
              >
                <MoreVertical className="size-4" />
              </DsButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="batch-action-menu">
              <DropdownMenuItem onSelect={() => openDetail(row.original)}>
                <Eye className="size-4" /> Detail
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openEdit(row.original)}>
                <Edit3 className="size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem disabled={row.original.status === 'Archived'} onSelect={() => archiveBatch(row.original)}>
                <Archive className="size-4" /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="batch-action-danger" onSelect={() => setDeleteTarget(row.original)}>
                <Trash2 className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        meta: { headerTitle: 'Aksi', cellClassName: 'text-right' },
      },
    ],
    [applicantCount, archiveBatch],
  );

  const table = useReactTable({
    columns,
    data: filtered,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  });

  const kpiDefs: Array<{ key: FilterKey; label: string; count: number; icon: typeof Layers3 }> = [
    { key: 'all', label: 'Total batch', count: store.batches.length, icon: Layers3 },
    { key: 'Open', label: 'Sedang terbuka', count: openCount, icon: Check },
    { key: 'Closed', label: 'Ditutup', count: closedCount, icon: X },
    { key: 'ongoing', label: 'Ongoing batch', count: ongoingCount, icon: CalendarClock },
  ];

  return (
    <section className="batch-management-page">
      <header className="batch-page-header">
        <div className="batch-title-row">
          <div>
            <h1>
              Batch <em>management.</em>
            </h1>
            <p>Kelola program dan periode pendaftaran member atau peserta CoPublika.</p>
          </div>
          <DsButton type="button" variant="primary" onClick={openCreate}>
            <Plus size={16} /> Buat batch baru
          </DsButton>
        </div>
      </header>

      <div className="batch-kpis" aria-label="Ringkasan batch">
        {kpiDefs.map(({ key, label, count, icon: Icon }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => selectFilter(key)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border bg-card p-5 text-left transition-all duration-200',
                'hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-[0_18px_38px_-26px_rgba(0,0,0,0.32)]',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
                active ? 'border-brand/60 shadow-[0_16px_34px_-26px_color-mix(in_srgb,var(--scopus)_60%,transparent)]' : 'border-border',
              )}
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-full w-1 bg-brand opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-3.5">
                <span
                  className={cn(
                    'grid size-11 place-items-center rounded-xl border transition-colors',
                    key === 'Open' && 'border-success/25 bg-success-soft text-success-accent',
                    key === 'Closed' && 'border-foreground/15 bg-foreground/[0.06] text-foreground',
                    key === 'ongoing' && 'border-warning/25 bg-warning-soft text-warning-accent',
                    key === 'all' && 'border-foreground/15 bg-foreground/[0.06] text-foreground',
                    active && 'border-foreground bg-foreground text-background',
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <small className="text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">{label}</small>
                  <strong className="font-mono text-[1.7rem] font-bold leading-none tracking-[-0.06em] text-foreground">{count}</strong>
                  {key === 'all' && <span className="mt-1 text-[11px] font-semibold text-foreground/60">{store.batches.length} batch terdata</span>}
                  {key === 'ongoing' && count > 0 && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand">
                      <Sparkles className="size-3" /> Aktif H-1
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="batch-status-tabs" role="tablist" aria-label="Filter status batch">
        {statusTabs.map(([key, label]) => {
          const active = filter === key;
          const count = key === 'all' ? store.batches.length : key === 'ongoing' ? ongoingCount : store.batches.filter((b) => b.status === key).length;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectFilter(key)}
              className={cn(
                'relative inline-flex items-center gap-2 px-3 py-3 text-[0.8125rem] font-semibold transition-colors duration-200',
                active ? 'text-foreground' : 'text-foreground/55 hover:text-foreground',
              )}
            >
              {label}
              <span className={cn('rounded-full px-2 py-0.5 font-mono text-[10px]', active ? 'bg-brand-soft text-brand-strong' : 'bg-foreground/8 text-foreground/60')}>{count}</span>
              <span className={cn('absolute inset-x-2 bottom-[-1px] h-0.5 origin-left scale-x-0 rounded-full bg-brand transition-transform duration-300', active && 'scale-x-100')} />
            </button>
          );
        })}
      </div>

      <Card className="batch-table-card">
        <div className="batch-table-toolbar">
          <label className="batch-search">
            <Search size={16} aria-hidden="true" />
            <Input aria-label="Cari batch" placeholder="Cari nama atau deskripsi…" value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} />
          </label>
          <Select value={filter} onValueChange={(value) => selectFilter(value as FilterKey)}>
            <SelectTrigger size="lg" className="batch-filter-trigger" aria-label="Filter status batch">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Open">Terbuka</SelectItem>
              <SelectItem value="Closed">Ditutup</SelectItem>
              <SelectItem value="Archived">Arsip</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="batch-panel-heading">
          <h2 className="batch-panel-title">Daftar batch</h2>
        </div>

        <CardContent className="batch-table-content">
          <DataGrid
            table={table}
            recordCount={filtered.length}
            emptyMessage="Batch tidak ditemukan. Coba ubah kata kunci atau filter status."
            tableLayout={{ headerSticky: true, rowBorder: true, columnsVisibility: false, width: 'fixed', dense: false }}
            tableClassNames={{ edgeCell: 'px-2', headerRow: 'bg-foreground', bodyRow: 'transition-colors duration-200 hover:bg-brand-soft/30' }}
          >
            <DataGridContainer border={false} className="batch-table-scroll">
              <DataGridTable />
            </DataGridContainer>
            <div className="batch-pagination-bar">
              <DataGridPagination sizes={[10, 25, 50]} sizesLabel="Baris" info="{from}–{to} dari {count} batch" className="text-background [&_.text-muted-foreground]:!text-background/80 [&_button]:!text-background [&_button:hover]:!bg-background/15 [&_button[aria-current=page]]:!border [&_button[aria-current=page]]:!border-background [&_button[aria-current=page]]:!bg-background/15 [&_button[aria-current=page]]:!text-background [&_[data-slot=select-trigger]]:!border-background/30 [&_[data-slot=select-trigger]]:!bg-background/10 [&_[data-slot=select-trigger]]:!text-background [&_svg]:!text-background" />
            </div>
          </DataGrid>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="batch-detail-dialog max-h-[calc(100vh-1.5rem)] max-w-2xl gap-0 overflow-y-auto p-0">
          {selected && (
            <>
              <div className="relative overflow-hidden border-b border-border bg-foreground/[0.025] p-6 sm:p-7">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand" />
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.12em] text-brand-foreground shadow-sm">
                  <ShieldCheck className="size-3.5" /> DETAIL BATCH
                </div>
                <DialogHeader className="space-y-1.5 text-left">
                  <DialogTitle className="pr-8 text-[1.45rem] font-bold leading-tight tracking-[-0.03em] text-foreground">{selected.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers3 className="size-3.5 text-brand" /> {purposeOf(selected)}
                    </span>
                    <span className="text-border">•</span>
                    <span className="font-mono text-xs">{selected.id}</span>
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-4 p-6 sm:p-7">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                    <FileText className="size-3.5 text-brand" />
                    Deskripsi
                  </div>
                  <p className="rounded-xl border border-brand/15 bg-brand-soft/40 p-4 text-sm leading-relaxed text-foreground/80">{selected.description || 'Belum ada deskripsi untuk batch ini.'}</p>
                </div>

                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                  <div className="space-y-2 bg-card px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-brand" />
                      Kategori
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">Batch Keanggotaan — Join Member</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">Khusus pendaftaran member baru.</p>
                  </div>
                  <div className="space-y-2 bg-card px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      <Clock3 className="size-3.5 text-brand" />
                      Status batch
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={selected.status === 'Open' ? 'success' : selected.status === 'Closed' ? 'destructive' : selected.status === 'Draft' ? 'warning' : 'secondary'}
                        appearance="light"
                        size="sm"
                        className="font-bold"
                      >
                        {statusMeta[selected.status].label}
                      </Badge>
                      {isOngoing(selected) && (
                        <Badge variant="warning" appearance="light" size="sm" className="font-bold">
                          Ongoing
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 bg-card px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      <CalendarDays className="size-3.5 text-brand" />
                      Jadwal buka
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">{formatDate(selected.startDate)}</div>
                  </div>
                  <div className="space-y-2 bg-card px-5 py-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                      <CalendarClock className="size-3.5 text-brand" />
                      Jadwal tutup
                    </div>
                    <div className="text-[13px] font-semibold text-foreground">{formatDate(selected.deadline)}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
                        <Users className="size-3.5" />
                      </span>
                      Kapasitas terpakai
                    </span>
                    <span className="flex items-center gap-2">
                      <Badge variant={selected.status === 'Open' ? 'success' : selected.status === 'Closed' ? 'destructive' : 'secondary'} appearance="light" size="sm">
                        {statusMeta[selected.status].label}
                      </Badge>
                      <b className="font-mono text-base">{occupancy(selected, applicantCount(selected.id))}%</b>
                    </span>
                  </div>
                  <Progress value={occupancy(selected, applicantCount(selected.id))} />
                  <p className="mt-2 text-xs text-muted-foreground">{applicantCount(selected.id)} pendaftar dari {selected.quota} kuota.</p>
                </div>

              </div>

              <DialogFooter className="gap-2 border-t border-border bg-foreground/[0.015] p-4 sm:p-5">
                <DsButton
                  type="button"
                  variant="outline"
                  onClick={() => openEdit(selected)}
                  className="border-border bg-background text-foreground hover:border-brand hover:bg-foreground hover:text-background"
                >
                  <Edit3 size={14} /> Edit batch
                </DsButton>
                <DsButton type="button" variant={selected.status === 'Open' ? 'destructive' : 'primary'} onClick={() => setPendingTransition(selected)}>
                  {selected.status === 'Open' ? <X size={14} /> : selected.status === 'Draft' ? <Check size={14} /> : <Archive size={14} />}
                  {statusMeta[selected.status].action}
                </DsButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="batch-form-dialog w-[min(720px,calc(100vw-2rem))] max-w-[720px] gap-0 overflow-hidden border-border bg-background p-0 shadow-[0_30px_90px_-34px_rgba(0,0,0,0.35)]">
          <div className="relative border-b border-border bg-card px-6 py-5 sm:px-7">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand" />
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-[1.25rem] font-bold tracking-tight text-foreground">{editingId ? 'Edit batch' : 'Buat batch baru'}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">Tentukan peruntukan dan periode registrasi. Semua perubahan tercatat di audit preview.</DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={saveBatch} className="space-y-4 px-6 py-5 sm:px-7">
            {/* Soft-lock: Batch khusus Join Member */}
            <div className="flex items-start gap-3 rounded-xl border border-brand/15 bg-brand-soft/40 px-4 py-3">
              <span className="mt-0.5 grid size-7 place-items-center rounded-lg bg-brand text-brand-foreground">
                <ShieldCheck className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.08em] text-brand-foreground">
                  BATCH KEANGGOTAAN
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                  Batch ini khusus untuk pendaftaran <b className="text-foreground">Join Member</b>. Kuota Bootcamp, Scopus 1-on-1, dan event atur di menu <b>Program / Event</b> masing-masing — tidak di sini.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="batch-name" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <Tag className="size-3.5 text-muted-foreground" /> Nama batch
              </Label>
              <Input id="batch-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Cohort #08 — Join Member" className="h-10" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="batch-quota" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Users className="size-3.5 text-muted-foreground" /> Kapasitas member
                </Label>
                <Input id="batch-quota" type="number" min="1" value={form.quota} onChange={(event) => setForm({ ...form, quota: event.target.value })} className="h-10" placeholder="60" />
                <span className="batch-field-help">Jumlah member yang dapat diterima di batch ini.</span>
              </div>

              <div className="space-y-1.5">
                <Label className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <Clock3 className="size-3.5 text-muted-foreground" /> Status awal
                </Label>
                <div className="flex h-10 items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                  <label
                    className={cn(
                      'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-bold transition-all',
                      form.status === 'Draft' ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <input type="radio" name="batch-status" value="Draft" checked={form.status === 'Draft'} onChange={() => setForm({ ...form, status: 'Draft' })} className="sr-only" />
                    <Archive className="size-3.5" /> Draft
                  </label>
                  <label
                    className={cn(
                      'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-bold transition-all',
                      form.status === 'Open' ? 'bg-brand text-brand-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <input type="radio" name="batch-status" value="Open" checked={form.status === 'Open'} onChange={() => setForm({ ...form, status: 'Open' })} className="sr-only" />
                    <Check className="size-3.5" /> Aktif
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="batch-start" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <CalendarDays className="size-3.5 text-muted-foreground" /> Jadwal buka
                </Label>
                <Input id="batch-start" type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="h-10" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="batch-deadline" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                  <CalendarClock className="size-3.5 text-muted-foreground" /> Jadwal tutup
                </Label>
                <Input id="batch-deadline" type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} className="h-10" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="batch-description" className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <FileText className="size-3.5 text-muted-foreground" /> Deskripsi
                <span className="font-normal text-muted-foreground">— opsional</span>
              </Label>
              <Textarea id="batch-description" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Jelaskan konteks, isi, atau manfaat batch ini…" className="resize-none" />
              <small className="text-xs text-muted-foreground">Flow registrasi ditentukan oleh peruntukan di atas.</small>
            </div>

            {formError && (
              <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive-soft px-3 py-2 text-sm font-semibold text-destructive" role="alert">
                {formError}
              </p>
            )}

            <DialogFooter className="mt-6 gap-2 border-t border-border pt-5">
              <DsButton type="button" variant="outline" onClick={() => setFormOpen(false)} className="border-border bg-background text-foreground hover:border-brand hover:bg-foreground hover:text-background">
                Batal
              </DsButton>
              <DsButton type="submit" variant="primary">
                <Check size={14} /> Simpan batch
              </DsButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={pendingTransition !== null} onOpenChange={(open) => !open && setPendingTransition(null)}>
        <DialogContent className="max-w-md">
          {pendingTransition && (
            <>
              <DialogHeader>
                <DialogTitle className="inline-flex items-center gap-2">
                  {pendingTransition.status === 'Draft' && <Check className="size-5 text-success" />}
                  {pendingTransition.status === 'Open' && <X className="size-5 text-destructive" />}
                  {pendingTransition.status === 'Closed' && <Archive className="size-5 text-foreground" />}
                  {pendingTransition.status === 'Archived' && <Layers3 className="size-5 text-brand" />}
                  {statusMeta[pendingTransition.status].action}?
                </DialogTitle>
                <DialogDescription>
                  {pendingTransition.name} — {statusMeta[pendingTransition.status].desc} Status akan berubah dari <b>{statusMeta[pendingTransition.status].label}</b> ke{' '}
                  <b>{statusMeta[nextStatus[pendingTransition.status]].label}</b>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DsButton type="button" variant="outline" onClick={() => setPendingTransition(null)} className="border-border bg-background text-foreground hover:border-brand hover:bg-foreground hover:text-background">
                  Batal
                </DsButton>
                <DsButton type="button" variant={pendingTransition.status === 'Open' ? 'destructive' : 'primary'} onClick={confirmTransition}>
                  {pendingTransition.status === 'Open' ? <X size={14} /> : <Check size={14} />} Ya, {statusMeta[pendingTransition.status].action.toLowerCase()}
                </DsButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="batch-delete-dialog">
          {deleteTarget &&
            (() => {
              const linked = applicantCount(deleteTarget.id);
              const blocked = linked > 0;
              return (
                <>
                  <DialogHeader>
                    <DialogTitle className="inline-flex items-center gap-2 text-destructive">
                      <Trash2 className="size-5" /> Hapus batch
                    </DialogTitle>
                    <DialogDescription>
                      {blocked ? `${deleteTarget.name} tidak dapat dihapus karena masih memiliki pendaftar.` : `${deleteTarget.name} akan dihapus permanen dari daftar batch.`}
                    </DialogDescription>
                  </DialogHeader>
                  {blocked ? (
                    <p className="batch-delete-note batch-delete-note--blocked" role="alert">
                      Batch ini terhubung dengan <b>{linked} pendaftar</b>. Menghapusnya akan memutus jejak audit pendaftar tersebut. Gunakan <b>Archive</b> untuk menonaktifkan batch tanpa
                      kehilangan data.
                    </p>
                  ) : (
                    <p className="batch-delete-note">Batch belum memiliki pendaftar sehingga aman dihapus. Gunakan <b>Archive</b> jika batch hanya perlu dinonaktifkan — Delete tidak dapat dibatalkan.</p>
                  )}
                  <DialogFooter>
                    <DsButton type="button" variant="outline" onClick={() => setDeleteTarget(null)} className="border-border bg-background text-foreground hover:border-brand hover:bg-foreground hover:text-background">
                      Batal
                    </DsButton>
                    {blocked ? (
                      <DsButton type="button" variant="primary" disabled={deleteTarget.status === 'Archived'} onClick={archiveFromDelete}>
                        <Archive size={14} /> Arsipkan batch
                      </DsButton>
                    ) : (
                      <DsButton type="button" variant="destructive" onClick={confirmDelete}>
                        <Trash2 size={14} /> Hapus batch
                      </DsButton>
                    )}
                  </DialogFooter>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </section>
  );
}
