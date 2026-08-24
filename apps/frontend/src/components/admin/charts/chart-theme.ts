'use client';

import {
  Chart as ChartJS,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

export const ORANGE = '#E9711C';
export const ORANGE_LIGHT = '#f59a4a';
export const ORANGE_DARK = '#b8580f';
export const ORANGE_SOFT = 'rgba(233, 113, 28, 0.12)';

export const SLATE = '#0F172A';
export const SLATE_2 = '#334155';
export const SLATE_3 = '#64748B';
export const SLATE_4 = '#94A3B8';

export const GRAY_BG = '#F8FAFC';
export const GRAY_LINE = '#E2E8F0';

export const GREEN = '#2f8a40';
export const BLUE = '#1e40af';
export const RED = '#c93737';
export const YELLOW = '#EAB308';
export const PURPLE = '#7c3aed';

export const CHART_FONT_FAMILY =
  '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const CHART_FONT_SIZE = 11;

export const CHART_TEXT_COLOR = SLATE_3;
export const CHART_TICK_COLOR = '#94A3B8';
export const CHART_GRID_COLOR = 'rgba(148, 163, 184, 0.15)';
export const CHART_TOOLTIP_BG = 'rgba(15, 23, 42, 0.95)';
export const CHART_TOOLTIP_TEXT = 'rgba(255, 255, 255, 0.85)';

export function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(233, 113, 28, ${alpha})`;
  const trimmed = hex.trim();
  if (trimmed.startsWith('rgb')) return trimmed;
  let normalized = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (normalized.length !== 6 || /[^0-9a-fA-F]/.test(normalized)) {
    return hex;
  }
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

let isRegistered = false;

export function registerCharts(): void {
  if (isRegistered) return;
  isRegistered = true;

  ChartJS.register(
    LineController,
    BarController,
    DoughnutController,
    PieController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  );

  ChartJS.defaults.font.family = CHART_FONT_FAMILY;
  ChartJS.defaults.font.size = CHART_FONT_SIZE;
  ChartJS.defaults.color = CHART_TEXT_COLOR;
  ChartJS.defaults.borderColor = GRAY_LINE;

  const anim = ChartJS.defaults.animation;
  if (anim && typeof anim === 'object') {
    (anim as Record<string, unknown>).duration = 800;
    (anim as Record<string, unknown>).easing = 'easeOutCubic';
  } else {
    ChartJS.defaults.animation = {
      duration: 800,
      easing: 'easeOutCubic',
    };
  }

  ChartJS.defaults.set('plugins.tooltip', {
    backgroundColor: CHART_TOOLTIP_BG,
    titleColor: '#fff',
    bodyColor: CHART_TOOLTIP_TEXT,
    padding: 10,
    cornerRadius: 8,
    titleFont: { size: 11, weight: 600 },
    bodyFont: { size: 11 },
    displayColors: true,
    boxPadding: 4,
  });
}
