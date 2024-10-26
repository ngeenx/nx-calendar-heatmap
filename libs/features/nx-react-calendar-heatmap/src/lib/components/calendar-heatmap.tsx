import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DateTime } from 'luxon';
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
  DayTippyUtils,
  HeatmapLevelsDirection,
  CalendarUtils,
} from '@ngeenx/nx-calendar-heatmap-utils';
import NxHeatmapLegend from './heatmap-legend';

interface CalendarHeatmapProps {
  options?: ICalendarHeatmapOptions;
  heatmapData?: IHeatmapDay[];
}

const NxCalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  options = {} as ICalendarHeatmapOptions,
  heatmapData = [],
}) => {
  const [levels, setLevels] = useState(5);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [range, setRange] = useState(0);
  const [step, setStep] = useState(0);
  const [firstWeekOffsetDays, setFirstWeekOffsetDays] = useState<IHeatmapDay[]>(
    []
  );
  const [lastWeekOffsetDays, setLastWeekOffsetDays] = useState<IHeatmapDay[]>(
    []
  );
  const [emptyCellStyle, setEmptyCellStyle] = useState<React.CSSProperties>({});

  const tippyUtils: DayTippyUtils | undefined = useMemo(
    () => new DayTippyUtils(options as ICalendarHeatmapOptions),
    []
  );

  const defaultOptions: ICalendarHeatmapOptions = {
    type: HeatMapCalendarType.YEARLY,
    startDate: DateTime.now().startOf('year'),
    locale: 'en',
    tooltip: {
      display: true,
      unit: 'contribution',
      dateFormat: 'MMMM d',
    },
    tippyProps: {
      placement: 'top',
    },
    heatmapLegend: {
      display: true,
      direction: HeatmapLevelsDirection.RIGHT,
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
  };

  const calendarUtils = useMemo(() => new CalendarUtils(defaultOptions), []);
  const mergedOptions: ICalendarHeatmapOptions = useMemo(
    () => ({
      ...defaultOptions,
      ...options,
      i18n: {
        ...defaultOptions.i18n,
        ...options.i18n,
      },
      heatmapLegend: {
        ...defaultOptions.heatmapLegend,
        ...options.heatmapLegend,
      },
      tooltip: {
        ...defaultOptions.tooltip,
        ...options.tooltip,
      },
    }),
    [options]
  );

  useEffect(() => {
    setEmptyCellStyle({
      height: `${mergedOptions.cellSize || 15}px`,
      width: `${mergedOptions.cellSize || 15}px`,
      ...mergedOptions.overWritedDayStyle,
    });

    const { colors } = mergedOptions;
    if (colors?.length) {
      setLevels(colors.length);
    } else {
      setLevels(5);
    }

    setMin(0);
    setMax(100);
    setRange(100);
    setStep(100 / levels);

    const { type, startDate } = mergedOptions;
    let endDate: DateTime;

    switch (type) {
      case HeatMapCalendarType.WEEKLY:
        endDate = startDate.plus({ days: 6 });
        break;
      case HeatMapCalendarType.MONTHLY:
        endDate = startDate.endOf('month');
        break;
      case HeatMapCalendarType.YEARLY:
        endDate = startDate.endOf('year');
        break;
    }

    if (type !== HeatMapCalendarType.WEEKLY) {
      setFirstWeekOffsetDays(calendarUtils.calculateFirstWeekOffset(startDate));
      setLastWeekOffsetDays(calendarUtils.calculateLastWeekOffset(endDate));
    }
  }, [calendarUtils, mergedOptions, levels]);

  const getGridPosition = useCallback(
    (index: number): React.CSSProperties => {
      return calendarUtils.getGridPositionOfDay(
        index,
        firstWeekOffsetDays.length
      ) as React.CSSProperties;
    },
    [calendarUtils, firstWeekOffsetDays]
  );

  const getDayClass = useCallback(
    (value: number | undefined): string => {
      const baseClasses = `${mergedOptions.onClick ? 'clickable' : ''}`;

      if (!mergedOptions.colors?.length) {
        if (value === 0 || value === undefined) {
          return `${baseClasses} level-0`;
        }

        for (let i = 0; i < levels; i++) {
          if (value <= min + step * (i + 1)) {
            return `${baseClasses} level-${i + 1}`;
          }
        }

        return `${baseClasses} level-0`;
      }

      if (value !== undefined) {
        for (const color of mergedOptions.colors) {
          if (
            color.min &&
            color.max &&
            value >= color.min &&
            value <= color.max
          ) {
            return color.className;
          }
        }
      }

      const defaultColor =
        mergedOptions.colors?.find((color: IHeatmapColor) => color.isDefault) ||
        mergedOptions.colors?.[0];
      return defaultColor ? defaultColor.className : `${baseClasses} level-0`;
    },
    [levels, min, step, mergedOptions]
  );

  const getEmptyDayClass = useCallback((): string => {
    const defaultColor = mergedOptions.colors?.find((color) => color.isDefault);
    return defaultColor ? defaultColor.className : 'level-0';
  }, [mergedOptions]);

  const onDayClick = useCallback(
    (day: IHeatmapDay): void => {
      mergedOptions.onClick?.(day);
    },
    [mergedOptions]
  );

  const onDayMouseOver = useCallback(
    (event: MouseEvent, day: IHeatmapDay): void => {
      tippyUtils?.lazyLoadTooltip(event, day);
    },
    [tippyUtils]
  );

  return (
    <div className="nx-calendar-heatmap">
      <div className="body">
        <div className="weekdays-container">
          {mergedOptions.type !== HeatMapCalendarType.WEEKLY && (
            <div className="weekdays">
              {mergedOptions.i18n?.weekdays?.map((weekday, index) => (
                <span key={index}>{weekday}</span>
              ))}
            </div>
          )}
          <div className="months-container">
            {mergedOptions.type === HeatMapCalendarType.YEARLY && (
              <div className="months">
                {mergedOptions.i18n?.months?.map((month, index) => (
                  <span key={index}>{month}</span>
                ))}
              </div>
            )}
            {mergedOptions.type === HeatMapCalendarType.MONTHLY && (
              <div className="months">
                <span className="centered">
                  {calendarUtils.getLocalizedMonthName(
                    mergedOptions.startDate,
                    mergedOptions.locale
                  )}
                </span>
              </div>
            )}
            <div
              className={`heatmap-grid ${
                mergedOptions.type === HeatMapCalendarType.MONTHLY
                  ? 'monthly'
                  : ''
              }`}
            >
              {!mergedOptions.hideEmptyDays &&
                firstWeekOffsetDays.map((day, index) => (
                  <button
                    key={index}
                    className={`day ${getEmptyDayClass()}`}
                    style={emptyCellStyle}
                    onMouseOver={(event: React.MouseEvent<HTMLButtonElement>) =>
                      onDayMouseOver(event.nativeEvent, day)
                    }
                  />
                ))}
              {heatmapData.map((day, index) => (
                <button
                  key={index}
                  className={`day ${getDayClass(day.count)}`}
                  style={getGridPosition(index)}
                  onClick={() => onDayClick(day)}
                  onMouseOver={(event: React.MouseEvent<HTMLButtonElement>) =>
                    onDayMouseOver(event.nativeEvent, day)
                  }
                />
              ))}
              {!mergedOptions.hideEmptyDays &&
                lastWeekOffsetDays.map((day, index) => (
                  <button
                    key={index}
                    className={`day ${getEmptyDayClass()}`}
                    style={emptyCellStyle}
                    onMouseOver={(event: React.MouseEvent<HTMLButtonElement>) =>
                      onDayMouseOver(event.nativeEvent, day)
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-content">
          {mergedOptions.heatmapLegend?.display && (
            <NxHeatmapLegend
              options={mergedOptions}
              min={min}
              max={max}
              range={range}
              step={step}
              levels={levels}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NxCalendarHeatmap;
