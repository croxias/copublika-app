'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions, Plugin } from 'chart.js';
import {
  registerCharts,
  ORANGE,
  ORANGE_LIGHT,
  SLATE_3,
  SLATE_4,
  CHART_GRID_COLOR,
  CHART_FONT_FAMILY,
  hexToRgba,
} from './chart-theme';

registerCharts();

interface LineDatasetInput {
  label?: string;
  data: number[];
  color?: string;
  fill?: boolean;
}

interface CpLineChartProps {
  labels: string[];
  datasets: LineDatasetInput[];
  height?: number;
  yFormat?: (v: number) => string;
  yMin?: number | 'auto';
  yMax?: number | 'auto';
  showLegend?: boolean;
  showGrid?: boolean;
  className?: string;
}

const lineGradientPlugin: Plugin<'line'> = {
  id: 'cpLineGradient',
  beforeDatasetsDraw(chart) {
    if (!('type' in chart.config) || chart.config.type !== 'line') return;
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    chart.data.datasets.forEach((dataset) => {
      if (dataset.fill === false) {
        dataset.backgroundColor = 'transparent';
        return;
      }
      const source =
        typeof dataset.borderColor === 'string' && dataset.borderColor.length > 0
          ? dataset.borderColor
          : ORANGE;
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom,
      );
      gradient.addColorStop(0, hexToRgba(source, 0.35));
      gradient.addColorStop(1, hexToRgba(source, 0));
      dataset.backgroundColor = gradient;
    });
  },
};

export const CpLineChart: React.FC<CpLineChartProps> = ({
  labels,
  datasets,
  height = 220,
  yFormat,
  yMin = 'auto',
  yMax = 'auto',
  showLegend = false,
  showGrid = true,
  className,
}) => {
  const data: ChartData<'line'> = useMemo(
    () => ({
      labels,
      datasets: datasets.map((ds) => {
        const color = ds.color ?? ORANGE;
        return {
          label: ds.label,
          data: ds.data,
          borderColor: color,
          backgroundColor: hexToRgba(color, 0.2),
          fill: ds.fill ?? true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointBackgroundColor: '#fff',
          pointBorderColor: color,
          pointBorderWidth: 2,
          pointHitRadius: 12,
        };
      }),
    }),
    [labels, datasets],
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: showLegend,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            color: SLATE_3,
            font: { size: 11, weight: 500, family: CHART_FONT_FAMILY },
            padding: 16,
          },
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: SLATE_4,
            font: { size: 10, weight: 500, family: CHART_FONT_FAMILY },
            padding: 8,
          },
        },
        y: {
          min: yMin === 'auto' ? undefined : yMin,
          max: yMax === 'auto' ? undefined : yMax,
          grid: {
            color: showGrid ? CHART_GRID_COLOR : 'transparent',
            drawTicks: false,
          },
          border: { display: false },
          ticks: {
            color: SLATE_4,
            font: { size: 10, weight: 500, family: CHART_FONT_FAMILY },
            padding: 8,
            maxTicksLimit: 6,
            callback: yFormat
              ? (value) => yFormat(Number(value))
              : undefined,
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 5,
          borderWidth: 2,
          backgroundColor: '#fff',
          borderColor: ORANGE_LIGHT,
        },
        line: {
          borderWidth: 2.5,
          tension: 0.4,
          capBezierPoints: true,
        },
      },
    }),
    [yFormat, yMin, yMax, showLegend, showGrid],
  );

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: `${height}px` }}
    >
      <Line data={data} options={options} plugins={[lineGradientPlugin]} />
    </div>
  );
};

export default CpLineChart;
