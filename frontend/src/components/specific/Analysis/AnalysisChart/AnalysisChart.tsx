import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TooltipItem,
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { format } from 'date-fns';
import { HiArrowsExpand, HiOutlineMinusSm, HiRefresh, HiEye, HiEyeOff } from 'react-icons/hi';
import { AnalyzedKeyword } from '../../../../types';
import {COLORS, MONTH_MAP} from "../../../../constants.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
    zoomPlugin
);

interface Props {
    selectedKeywords: AnalyzedKeyword[];
}

const AnalysisChart: React.FC<Props> = ({ selectedKeywords }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const chartRef = useRef<any>(null);
    const [hiddenDatasets, setHiddenDatasets] = useState<Set<string>>(new Set());

    const { data, options, hasData, allKeywordLabels } = useMemo(() => {
        let minTs = Infinity;
        let maxTs = -Infinity;
        let globalForecastStartTs = Infinity;

        const uniqueKeywordLabels: string[] = [];
        const labelToIndexMap = new Map<string, number>();

        selectedKeywords.forEach(kw => {
            if (!labelToIndexMap.has(kw.text)) {
                labelToIndexMap.set(kw.text, uniqueKeywordLabels.length);
                uniqueKeywordLabels.push(kw.text);
            }
        });

        selectedKeywords.forEach(kw => {
            if (kw.forecast?.forecast_series) {
                kw.forecast.forecast_series.forEach(pt => {
                    const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                    globalForecastStartTs = Math.min(globalForecastStartTs, ts);
                });
            }
        });

        const datasets = selectedKeywords.map((kw, index) => {
            const color = COLORS[index % COLORS.length];
            const dataPoints: { x: number, y: number }[] = [];
            const pointMap = new Map<number, number>();

            const addPoint = (ts: number, val: number) => {
                if (!pointMap.has(ts)) {
                    pointMap.set(ts, val);
                    minTs = Math.min(minTs, ts);
                    maxTs = Math.max(maxTs, ts);
                }
            };

            kw.history?.monthly_search_volumes.forEach(pt => {
                const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                if (ts <= globalForecastStartTs) addPoint(ts, pt.monthly_searches);
            });

            kw.forecast?.forecast_series.forEach(pt => {
                const ts = Date.UTC(pt.year, MONTH_MAP[pt.month], 1);
                if (ts === globalForecastStartTs && pointMap.has(ts)) return;
                addPoint(ts, pt.search_volume_forecast);
            });

            Array.from(pointMap.entries())
                .sort((a, b) => a[0] - b[0])
                .forEach(([x, y]) => dataPoints.push({ x, y }));

            const isHidden = hiddenDatasets.has(kw.text);

            return {
                label: kw.text,
                data: dataPoints,
                borderColor: color,
                backgroundColor: color,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHitRadius: 10,
                tension: 0.3,
                hidden: isHidden,
                segment: {
                    borderDash: (ctx: any) => {
                        return ctx.p0.parsed.x >= globalForecastStartTs ? [6, 6] : undefined;
                    }
                }
            };
        });

        const chartOptions: ChartOptions<'line'> = {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',  // Find the single nearest point
                axis: 'xy',       // Consider both X and Y distance (better for overlapping lines)
                intersect: true,  // Only trigger when mouse actually 'hits' the point (uses pointHitRadius)
            },
            animation: { duration: 800 },
            layout: {
                padding: { top: 30, right: 20, left: 10, bottom: 20 }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'month', tooltipFormat: 'MMM yyyy' },
                    grid: { display: false },
                    border: { display: false },
                    ticks: { maxRotation: 0, autoSkip: true, autoSkipPadding: 20, font: { size: 11 }, color: '#9ca3af' }
                },
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 11 }, callback: (val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(Number(val)) }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 6,
                    caretPadding: 15,
                    usePointStyle: true,
                    titleFont: { weight: 'bold', size: 13 },
                    bodyFont: { family: 'monospace', weight: 'bold', size: 12 },
                    callbacks: {
                        title: (items) => {
                            if (!items.length || !items[0].parsed.x) return '';
                            return format(new Date(items[0].parsed.x), 'MMMM yyyy');
                        },
                        label: (item: TooltipItem<'line'>) => {
                            if (item.parsed.y === null || item.parsed.x === null) return '';
                            const val = new Intl.NumberFormat('en-US').format(item.parsed.y);
                            const isForecast = item.parsed.x >= globalForecastStartTs;
                            return ` ${item.dataset.label}: ${val} ${isForecast ? '(FCST)' : ''}`;
                        }
                    }
                },
                zoom: {
                    pan: { enabled: true, mode: 'x' },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'x',
                    },
                    limits: { x: { min: minTs, max: maxTs } }
                },
                annotation: {
                    annotations: (globalForecastStartTs !== Infinity && maxTs !== -Infinity) ? {
                        forecastArea: {
                            type: 'box',
                            xMin: globalForecastStartTs,
                            xMax: maxTs,
                            backgroundColor: 'rgba(129, 140, 248, 0.03)',
                            borderWidth: 0,
                            drawTime: 'beforeDatasetsDraw'
                        },
                        forecastLine: {
                            type: 'line',
                            xMin: globalForecastStartTs,
                            xMax: globalForecastStartTs,
                            borderColor: '#818cf8',
                            borderWidth: 2,
                            borderDash: [4, 4],
                            label: {
                                display: true,
                                content: 'FORECAST',
                                // Using 'any' here to bypass strict typing that doesn't officially support xValue/yValue in all versions
                                // but works at runtime for precise positioning.
                                xValue: globalForecastStartTs + (maxTs - globalForecastStartTs) / 2,
                                yValue: '100%',
                                yAdjust: -15,
                                backgroundColor: '#818cf8',
                                color: 'white',
                                font: { weight: 'bold', size: 10 },
                                padding: { x: 8, y: 5 },
                                borderRadius: 4,
                            } as any
                        }
                    } : {}
                }
            }
        };

        return {
            data: { datasets },
            options: chartOptions,
            hasData: datasets.length > 0,
            allKeywordLabels: uniqueKeywordLabels,
        };

    }, [selectedKeywords, hiddenDatasets]);

    const handleResetZoom = () => {
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    const toggleDatasetVisibility = useCallback((label: string) => {
        setHiddenDatasets(prev => {
            const newSet = new Set(prev);
            if (newSet.has(label)) {
                newSet.delete(label);
            } else {
                newSet.add(label);
            }
            return newSet;
        });
    }, []);

    const toggleAllDatasets = useCallback((showAll: boolean) => {
        if (showAll) {
            setHiddenDatasets(new Set());
        } else {
            setHiddenDatasets(new Set(allKeywordLabels));
        }
    }, [allKeywordLabels]);


    if (!hasData) {
        return (
            <div className="h-96 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-gray-200 font-medium">
                Select keywords below to view analysis
            </div>
        );
    }

    const containerClasses = isFullscreen
        ? "fixed inset-6 z-50 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 ease-in-out"
        : "relative w-full bg-white p-4 pt-2 rounded-xl shadow-sm border border-gray-200 flex flex-col transition-all duration-300 ease-in-out";

    const chartAreaClasses = isFullscreen
        ? "flex-grow relative min-h-0"
        : "h-96 relative";

    return (
        <div className={containerClasses}>
            <div className="flex justify-between items-center flex-shrink-0 mb-3">
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleAllDatasets(true)}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Select All
                    </button>
                    <button
                        onClick={() => toggleAllDatasets(false)}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Deselect All
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleResetZoom}
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-all flex items-center gap-1 text-xs font-medium"
                        title="Reset Zoom"
                    >
                        <HiRefresh size={16} /> Reset
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-all"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <HiOutlineMinusSm size={20} /> : <HiArrowsExpand size={18} />}
                    </button>
                </div>
            </div>

            <div className={chartAreaClasses}>
                <Line ref={chartRef} data={data} options={options as any} />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 max-h-48 overflow-y-auto flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                    {data.datasets.map((dataset, _i) => {
                        const isHidden = hiddenDatasets.has(dataset.label || '');
                        const color = dataset.backgroundColor as string;

                        return (
                            <div
                                key={dataset.label}
                                className={`flex items-center gap-2 cursor-pointer text-sm py-1 px-2 rounded-md transition-colors ${
                                    isHidden ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                onClick={() => toggleDatasetVisibility(dataset.label || '')}
                                title={dataset.label}
                            >
                                <div
                                    className={`w-3 h-3 rounded-full flex-shrink-0`}
                                    style={{ backgroundColor: color, opacity: isHidden ? 0.4 : 1 }}
                                ></div>
                                <span className={`truncate ${isHidden ? 'line-through opacity-60' : ''}`}>
                                    {dataset.label}
                                </span>
                                {isHidden ? (
                                    <HiEyeOff size={16} className="ml-auto text-gray-400 flex-shrink-0" />
                                ) : (
                                    <HiEye size={16} className="ml-auto text-gray-500 flex-shrink-0" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalysisChart;