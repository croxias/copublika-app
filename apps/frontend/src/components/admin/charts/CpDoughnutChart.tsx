'use client';

import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  registerCharts,
  SLATE,
  SLATE_3,
  CHART_FONT_FAMILY,
} from './chart-theme';

registerCharts();

interface CenterLabel {
  value: string;
  subtext?: string;
}

interface CpDoughnutChartProps {
  labels: string[];
  data: number[];
  colors: string[];
  centerLabel?: CenterLabel;
  cutout?: string;
  height?: number;
  showLegend?: boolean;
  className?: string;
}

export const CpDoughnutChart: React.FC<CpDoughnutChartProps> = ({
  labels,
  data,
  colors,
  centerLabel,
  cutout = '65%',
  height = 200,
  showLegend = false,
  className,
}) => {
  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 0,
          hoverBorderWidth: 2,
        },
      ],
    }),
    [labels, data, colors],
  );

  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout,
      layout: {
        padding: centerLabel ? 0 : 4,
      },
      plugins: {
        legend: {
          display: showLegend,
          position: 'right',
          align: 'center',
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            color: SLATE_3,
            font: { size: 11, weight: 500, family: CHART_FONT_FAMILY },
            padding: 12,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      animation: {
        duration: 800,
        easing: 'easeOutCubic',
      },
      animations: {
        colors: false,
        numbers: false,
      },
      transitions: {
        active: {
          animation: {
            duration: 0,
          },
        },
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 0,
        },
      },
    }),
    [cutout, showLegend, centerLabel],
  );

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: `${height}px` }}
    >
      <Doughnut data={chartData} options={options} />
      {centerLabel && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: CHART_FONT_FAMILY,
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.1,
              color: SLATE,
              letterSpacing: '-0.01em',
            }}
          >
            {centerLabel.value}
          </div>
          {centerLabel.subtext && (
            <div
              style={{
                fontFamily: CHART_FONT_FAMILY,
                fontSize: 11,
                fontWeight: 500,
                lineHeight: 1.2,
                color: SLATE_3,
                marginTop: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {centerLabel.subtext}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CpDoughnutChart;
