'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import {
  registerCharts,
  ORANGE,
  SLATE_3,
  SLATE_4,
  CHART_GRID_COLOR,
  CHART_FONT_FAMILY,
} from './chart-theme';

registerCharts();

interface BarGradient {
  from: string;
  to: string;
}

interface CpBarChartProps {
  labels: string[];
  data: number[];
  color?: string;
  gradient?: BarGradient;
  horizontal?: boolean;
  height?: number;
  showValues?: boolean;
  className?: string;
}

function formatValue(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toLocaleString('en-US');
}

const barGradientPlugin = (gradient: BarGradient): Plugin<'bar'> => ({
  id: 'cpBarGradient',
  beforeDatasetsDraw(chart) {
    if (!('type' in chart.config) || chart.config.type !== 'bar') return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const isHorizontal = chart.options.indexAxis === 'y';
    const grad = isHorizontal
      ? ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
      : ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    grad.addColorStop(0, gradient.from);
    grad.addColorStop(1, gradient.to);
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = grad;
      dataset.hoverBackgroundColor = grad;
    });
  },
});

const barValueLabelPlugin: Plugin<'bar'> = {
  id: 'cpBarValueLabel',
  afterDatasetsDraw(chart) {
    if (!('type' in chart.config) || chart.config.type !== 'bar') return;
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;
    const dataset = chart.data.datasets[0];
    const values = dataset.data as number[];
    const isHorizontal = chart.options.indexAxis === 'y';
    ctx.save();
    ctx.fillStyle = SLATE_3;
    ctx.font = `500 11px ${CHART_FONT_FAMILY}`;
    ctx.textBaseline = 'middle';
    meta.data.forEach((bar, index) => {
      const raw = values[index];
      if (typeof raw !== 'number' || !Number.isFinite(raw)) return;
      const text = formatValue(raw);
      if (isHorizontal) {
        ctx.textAlign = 'left';
        ctx.fillText(text, (bar as { x: number }).x + 8, (bar as { y: number }).y);
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(text, (bar as { x: number }).x, (bar as { y: number }).y - 8);
      }
    });
    ctx.restore();
  },
};

export const CpBarChart: React.FC<CpBarChartProps> = ({
  labels,
  data,
  color = ORANGE,
  gradient,
  horizontal = false,
  height = 220,
  showValues = false,
  className,
}) => {
  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: color,
          hoverBackgroundColor: color,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: horizontal ? 14 : 32,
          barThickness: horizontal ? 14 : undefined,
          minBarLength: 2,
        },
      ],
    }),
    [labels, data, color, horizontal],
  );

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? 'y' : 'x',
      layout: {
        padding: showValues
          ? horizontal
            ? { right: 8, top: 4, bottom: 4 }
            : { top: 18, left: 4, right: 4 }
          : { top: 4, bottom: 4, left: 4, right: 4 },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctxItem) => {
              const v = ctxItem.parsed[horizontal ? 'x' : 'y'];
              if (typeof v !== 'number') return '';
              return ` ${formatValue(v)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: horizontal,
            color: CHART_GRID_COLOR,
            drawTicks: false,
          },
          border: { display: false },
          ticks: {
            color: SLATE_4,
            font: { size: 10, weight: 500, family: CHART_FONT_FAMILY },
            padding: 8,
            maxTicksLimit: 6,
            callback: horizontal
              ? (value) => formatValue(Number(value))
              : undefined,
          },
        },
        y: {
          grid: {
            display: !horizontal,
            color: CHART_GRID_COLOR,
            drawTicks: false,
          },
          border: { display: false },
          ticks: {
            color: SLATE_4,
            font: { size: 10, weight: 500, family: CHART_FONT_FAMILY },
            padding: 8,
            maxTicksLimit: 8,
            callback: !horizontal
              ? (value) => formatValue(Number(value))
              : undefined,
          },
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutCubic',
      },
    }),
    [horizontal, showValues],
  );

  const plugins = useMemo<Plugin<'bar'>[]>(() => {
    const list: Plugin<'bar'>[] = [];
    if (gradient) list.push(barGradientPlugin(gradient));
    if (showValues) list.push(barValueLabelPlugin);
    return list;
  }, [gradient, showValues]);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: `${height}px` }}
    >
      <Bar data={chartData} options={options} plugins={plugins} />
    </div>
  );
};

export default CpBarChart;
