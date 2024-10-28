import React, { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';
import { NxCalendarHeatmap } from '@ngeenx/nx-react-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  HeatmapLevelsDirection,
} from '@ngeenx/nx-calendar-heatmap-utils';
import HeatmapFooterHint from './HeatmapFooterHint';

interface YearlyViewProps {
  selectedColorVariant: IHeatmapColor[];
  selectedYear: number;
  selectedHeatmapLevelState: boolean;
  selectedLocale: string;
}

const YearlyView: React.FC<YearlyViewProps> = ({
  selectedColorVariant,
  selectedYear,
  selectedHeatmapLevelState,
  selectedLocale,
}) => {
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('year')
  );
  const [heatmapData, setHeatmapData] = useState<IHeatmapDay[]>([]);
  const [options, setOptions] = useState<ICalendarHeatmapOptions>({
    type: HeatMapCalendarType.YEARLY,
    startDate,
    cellSize: 15,
    hideEmptyDays: false,
    locale: selectedLocale,
    colors: selectedColorVariant,
    tooltip: {
      display: true,
      unit: 'contribution',
      dateFormat: 'MMMM d',
    },
    heatmapLegend: {
      display: selectedHeatmapLevelState,
      direction: HeatmapLevelsDirection.RIGHT,
    },
    onClick: (day: IHeatmapDay) => {
      console.log(`Clicked on ${day.date} with value ${day.count}`);
    },
    i18n: {
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      on: 'on',
      less: 'less',
      more: 'more',
      noData: 'No',
      min: 'min',
      max: 'max',
    },
  });

  const generateHeatmapData = useCallback((startDate: DateTime) => {
    const endDate = startDate.endOf('year');
    const daysBetween = Math.floor(endDate.diff(startDate, 'days').days);
    const heatmap: IHeatmapDay[] = [];

    let currentDate = startDate;
    for (let i = 0; i <= daysBetween; i++) {
      heatmap.push({
        date: currentDate,
        count: Math.floor(Math.random() * 101),
      });
      currentDate = currentDate.plus({ days: 1 });
    }
    return heatmap;
  }, []);

  useEffect(() => {
    setStartDate(DateTime.fromObject({ year: selectedYear }).startOf('year'));
  }, [selectedYear]);

  useEffect(() => {
    setHeatmapData(generateHeatmapData(startDate));
  }, [startDate, generateHeatmapData]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      startDate,
      colors: selectedColorVariant,
      locale: selectedLocale,
      heatmapLegend: {
        ...prevOptions.heatmapLegend,
        display: selectedHeatmapLevelState,
      },
    }));
  }, [
    startDate,
    selectedColorVariant,
    selectedLocale,
    selectedHeatmapLevelState,
  ]);

  return (
    <div className="flex flex-col items-start justify-start gap-3 p-5">
      <span> Yearly </span>
      <div className="p-4 border border-gray-500 rounded-md dark:bg-gray-800">
        <NxCalendarHeatmap
          options={options}
          data={heatmapData}
          footerContent={<HeatmapFooterHint />}
        />
      </div>
    </div>
  );
};

export default YearlyView;
