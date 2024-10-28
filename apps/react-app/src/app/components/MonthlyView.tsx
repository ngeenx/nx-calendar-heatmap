import { useEffect, useState, useCallback } from 'react';
import { DateTime } from 'luxon';
import { NxCalendarHeatmap } from '@ngeenx/nx-react-calendar-heatmap';
import {
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  IHeatmapDay,
} from '@ngeenx/nx-calendar-heatmap-utils';

interface MonthlyViewProps {
  selectedColorVariant?: IHeatmapColor[];
  selectedYear?: number;
  selectedHeatmapLevelState?: boolean;
  selectedLocale?: string;
}

const MonthView: React.FC<MonthlyViewProps> = ({
  selectedColorVariant = [],
  selectedYear = DateTime.now().year,
  selectedHeatmapLevelState = true,
  selectedLocale = 'en',
}) => {
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('year')
  );
  const [heatmapData, setHeatmapData] = useState<IHeatmapDay[][]>([]);
  const [options, setOptions] = useState({
    type: HeatMapCalendarType.MONTHLY,
    startDate,
    cellSize: 15,
    hideEmptyDays: false,
    colors: selectedColorVariant,
    heatmapLegend: {
      display: selectedHeatmapLevelState,
      direction: 'RIGHT',
    },
    overWritedDayStyle: {
      borderRadius: '50%',
    },
    locale: selectedLocale,
  });

  const months = Array.from({ length: 12 }, (_, i) =>
    DateTime.local().set({ year: selectedYear, month: i + 1, day: 1 })
  );

  const generateHeatmapData = useCallback((startDate: DateTime) => {
    const endDate = startDate.endOf('month');
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
    setHeatmapData(
      months.map((firstDayOfMonth: DateTime): IHeatmapDay[] =>
        generateHeatmapData(firstDayOfMonth)
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedYear,
    selectedColorVariant,
    selectedHeatmapLevelState,
    selectedLocale,
    generateHeatmapData,
  ]);

  useEffect(() => {
    setStartDate(DateTime.local(selectedYear, 1, 1));

    setOptions((prevOptions) => ({
      ...prevOptions,
      startDate: DateTime.fromJSDate(new Date(`${selectedYear}-01-01`)),
      colors: selectedColorVariant,
      locale: selectedLocale,
      heatmapLegend: {
        ...prevOptions.heatmapLegend,
        display: selectedHeatmapLevelState,
      },
    }));
  }, [
    selectedYear,
    selectedColorVariant,
    selectedHeatmapLevelState,
    selectedLocale,
  ]);

  return (
    <div className="flex flex-col items-start justify-start gap-3 p-5">
      <span> Monthly </span>

      <div className="flex flex-row flex-wrap gap-5 p-4 bg-white border border-gray-500 rounded-md dark:bg-gray-800">
        {heatmapData.map((_heatmapDataMonthly, index) => (
          <div className="p-4 border border-gray-500 rounded-md" key={index}>
            <NxCalendarHeatmap
              options={
                {
                  ...options,
                  startDate: months[index],
                } as ICalendarHeatmapOptions
              }
              data={_heatmapDataMonthly}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
