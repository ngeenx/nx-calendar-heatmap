import React, { useEffect, useState, useCallback } from 'react';
import { DateTime } from 'luxon';
import { NxCalendarHeatmap } from '@ngeenx/nx-react-calendar-heatmap';
import {
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  IHeatmapDay,
} from '@ngeenx/nx-calendar-heatmap-utils';

interface WeeklyViewProps {
  selectedColorVariant?: IHeatmapColor[];
  selectedYear?: number;
  selectedHeatmapLevelState?: boolean;
  selectedLocale?: string;
}

const WeeklyHeatmap: React.FC<WeeklyViewProps> = ({
  selectedColorVariant = [],
  selectedYear = DateTime.now().year,
  selectedHeatmapLevelState = true,
  selectedLocale = 'en',
}) => {
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('year')
  );
  const [heatmapData, setHeatmapData] = useState<IHeatmapDay[]>([]);

  const options = {
    type: HeatMapCalendarType.WEEKLY,
    startDate,
    cellSize: 15,
    hideEmptyDays: false,
    colors: selectedColorVariant,
    tippyProps: {
      placement: 'bottom',
    },
    heatmapLegend: {
      display: selectedHeatmapLevelState,
      direction: 'LEFT',
    },
    locale: selectedLocale,
  } as object as ICalendarHeatmapOptions;

  const generateHeatmapData = useCallback((startDate: DateTime) => {
    const endDate = startDate.plus({ days: 6 });
    const daysBetween = Math.floor(endDate.diff(startDate, 'days').days);
    const heatmap = [];

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
    setStartDate(DateTime.local(selectedYear, 1, 1));

    setHeatmapData(generateHeatmapData(DateTime.local(selectedYear, 1, 1)));
  }, [
    selectedYear,
    selectedColorVariant,
    selectedHeatmapLevelState,
    selectedLocale,
    generateHeatmapData,
  ]);

  return (
    <div className="flex flex-col items-start justify-start gap-3 p-5">
      <span> Weekly </span>

      <div className="p-4 border border-gray-500 rounded-md dark:bg-gray-800">
        <NxCalendarHeatmap options={options} data={heatmapData} />
      </div>
    </div>
  );
};

export default WeeklyHeatmap;
