import React, { useState, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import YearlyView from './components/YearlyView';
// import MonthlyView from './components/MonthlyView';
// import WeeklyView from './components/WeeklyView';
import { IHeatmapColor } from '@ngeenx/nx-calendar-heatmap-utils';

import '/libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss';
import '/libs/utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
import '../../../../node_modules/tippy.js/dist/tippy.css';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';

const App: React.FC = () => {
  const heatmapColorsVariants: IHeatmapColor[][] = useMemo(
    () => [
      // variant 1
      [
        {
          min: Number.NEGATIVE_INFINITY,
          max: 0,
          isDefault: true,
          className: 'custom-variant1-level-0',
        },
        {
          min: 1,
          max: 10,
          isDefault: false,
          className: 'custom-variant1-level-1',
        },
        {
          min: 10,
          max: 30,
          isDefault: false,
          className: 'custom-variant1-level-2',
        },
        {
          min: 30,
          max: 40,
          isDefault: false,
          className: 'custom-variant1-level-3',
        },
        {
          min: 40,
          max: 50,
          isDefault: false,
          className: 'custom-variant1-level-4',
        },
        {
          min: 50,
          max: Number.POSITIVE_INFINITY,
          isDefault: false,
          className: 'custom-variant1-level-5',
        },
      ],
      // variant 2
      [
        {
          min: Number.NEGATIVE_INFINITY,
          max: 0,
          isDefault: true,
          className: 'custom-variant2-level-0',
        },
        {
          min: 1,
          max: 10,
          isDefault: false,
          className: 'custom-variant2-level-1',
        },
        {
          min: 10,
          max: 30,
          isDefault: false,
          className: 'custom-variant2-level-2',
        },
        {
          min: 30,
          max: 40,
          isDefault: false,
          className: 'custom-variant2-level-3',
        },
        {
          min: 40,
          max: 50,
          isDefault: false,
          className: 'custom-variant2-level-4',
        },
        {
          min: 50,
          max: Number.POSITIVE_INFINITY,
          isDefault: false,
          className: 'custom-variant2-level-5',
        },
      ],
      // variant 3
      [
        {
          min: Number.NEGATIVE_INFINITY,
          max: 0,
          isDefault: true,
          className: 'custom-variant3-level-0',
        },
        {
          min: 1,
          max: 10,
          isDefault: false,
          className: 'custom-variant3-level-1',
        },
        {
          min: 10,
          max: 30,
          isDefault: false,
          className: 'custom-variant3-level-2',
        },
        {
          min: 30,
          max: 40,
          isDefault: false,
          className: 'custom-variant3-level-3',
        },
        {
          min: 40,
          max: 50,
          isDefault: false,
          className: 'custom-variant3-level-4',
        },
        {
          min: 50,
          max: Number.POSITIVE_INFINITY,
          isDefault: false,
          className: 'custom-variant3-level-5',
        },
      ],
      // variant 4
      [
        {
          min: Number.NEGATIVE_INFINITY,
          max: 0,
          isDefault: true,
          className: 'custom-variant4-level-0',
        },
        {
          min: 1,
          max: 10,
          isDefault: false,
          className: 'custom-variant4-level-1',
        },
        {
          min: 10,
          max: 30,
          isDefault: false,
          className: 'custom-variant4-level-2',
        },
        {
          min: 30,
          max: 40,
          isDefault: false,
          className: 'custom-variant4-level-3',
        },
        {
          min: 40,
          max: 50,
          isDefault: false,
          className: 'custom-variant4-level-4',
        },
        {
          min: 50,
          max: Number.POSITIVE_INFINITY,
          isDefault: false,
          className: 'custom-variant4-level-5',
        },
      ],
    ],
    []
  );

  const [selectedColorVariant, setSelectedColorVariant] = useState<
    IHeatmapColor[] | null
  >([]);
  const [selectedHeatmapLevelState, setSelectedHeatmapLevelState] =
    useState<boolean>(true);
  const [selectedLocale, setSelectedLocale] = useState<string>('en');
  const [selectedYear, setSelectedYear] = useState<number>(DateTime.now().year);

  const locales: string[] = ['en', 'tr', 'fr', 'de', 'ja', 'zh'];
  const years: number[] = Array.from(
    { length: 30 },
    (_, i) => i + 1998
  ).reverse();
  const heatmapLevelDisplayOptions = [true, false];

  const onColorVariantChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedVariant = heatmapColorsVariants.find((variant) =>
        variant.some((color) => color.className === event.target.value)
      );
      setSelectedColorVariant(selectedVariant || []);
    },
    [heatmapColorsVariants]
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-row gap-5 p-3">
        {/* Year Selection */}
        <div className="flex flex-col w-3/12 gap-3 m-2">
          <span> Year </span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="p-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
          >
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Color Variant Selection */}
        <div className="flex flex-col w-3/12 gap-3 m-2">
          <span> Color Variant </span>
          <select
            onChange={onColorVariantChange}
            className="p-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
          >
            <option value="default">Default</option>
            {heatmapColorsVariants.map((variant, index) => (
              <option key={index} value={variant[0].className}>
                {variant[0].className}
              </option>
            ))}
          </select>
        </div>

        {/* Display Heatmap Level */}
        <div className="flex flex-col w-3/12 gap-3 m-2">
          <span> Display Heatmap Level </span>
          <select
            value={String(selectedHeatmapLevelState)}
            onChange={(e) =>
              setSelectedHeatmapLevelState(e.target.value === 'true')
            }
            className="p-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
          >
            {heatmapLevelDisplayOptions.map((option, index) => (
              <option key={index} value={String(option)}>
                {String(option)}
              </option>
            ))}
          </select>
        </div>

        {/* Locale Selection */}
        <div className="flex flex-col w-3/12 gap-3 m-2">
          <span>
            Locale
            <a
              href="https://moment.github.io/luxon/#/intl?id=how-locales-work"
              target="_blank"
              className="ml-2 text-blue-300 underline"
              rel="noreferrer"
            >
              how-locales-work?
            </a>
          </span>
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="p-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
          >
            {locales.map((locale, index) => (
              <option key={index} value={locale}>
                {locale}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col items-start justify-start dark:bg-gray-900">
        <YearlyView
          selectedColorVariant={selectedColorVariant}
          selectedYear={selectedYear}
          selectedHeatmapLevelState={selectedHeatmapLevelState}
          selectedLocale={selectedLocale}
        />
        <MonthlyView
          selectedColorVariant={selectedColorVariant}
          selectedYear={selectedYear}
          selectedHeatmapLevelState={selectedHeatmapLevelState}
          selectedLocale={selectedLocale}
        />
        <WeeklyView
          selectedColorVariant={selectedColorVariant}
          selectedYear={selectedYear}
          selectedHeatmapLevelState={selectedHeatmapLevelState}
          selectedLocale={selectedLocale}
        />
      </div>
    </div>
  );
};

export default App;
