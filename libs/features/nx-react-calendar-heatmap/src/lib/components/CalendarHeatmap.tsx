import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
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
import NxHeatmapLegend from './HeatmapLegend';
import { Props } from 'tippy.js';

interface CalendarHeatmapProps {
  options?: Partial<ICalendarHeatmapOptions>;
  heatmapData?: IHeatmapDay[];
  footerContent?: ReactNode | null;
}

const NxCalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  options = {} as ICalendarHeatmapOptions,
  heatmapData = [],
  footerContent = null,
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

  let tippyUtils: DayTippyUtils | undefined;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    tippyUtils = new DayTippyUtils(mergedOptions);
    tippyUtils.init();

    return () => {
      tippyUtils?.destroy();
    };
  }, []);

  const defaultOptions: ICalendarHeatmapOptions = useMemo(
    () => ({
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
      } as Props,
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
    }),
    []
  );

  const calendarUtilsRef = useRef(new CalendarUtils(defaultOptions));
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
    [defaultOptions, options]
  );

  // #region Styling

  const getGridPosition = useCallback(
    (index: number): React.CSSProperties => {
      return calendarUtilsRef.current.getGridPositionOfDay(
        index,
        firstWeekOffsetDays.length
      ) as React.CSSProperties;
    },
    [calendarUtilsRef, firstWeekOffsetDays]
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

  // #endregion

  // #region Localization

  const updateCalendarLabels = useCallback(() => {
    if (mergedOptions.i18n) {
      mergedOptions.i18n.months =
        calendarUtilsRef.current.getLocalizedMonthNames(mergedOptions.locale);
      mergedOptions.i18n.weekdays =
        calendarUtilsRef.current.getLocalizedWeekdayNames(mergedOptions.locale);
    }
  }, [mergedOptions.i18n, mergedOptions.locale]);

  // #endregion

  // #region Events

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

  // #endregion

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
      setFirstWeekOffsetDays(
        calendarUtilsRef.current.calculateFirstWeekOffset(startDate)
      );
      setLastWeekOffsetDays(
        calendarUtilsRef.current.calculateLastWeekOffset(endDate)
      );
    }
  }, [mergedOptions, heatmapData, levels]);

  useEffect(() => {
    calendarUtilsRef.current = new CalendarUtils(mergedOptions);

    updateCalendarLabels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOptions.i18n, mergedOptions.i18n, mergedOptions.locale]);

  return (
    // Calendar Container
    <div className="nx-calendar-heatmap">
      {/* Body */}
      <div className="body">
        <div className="weekdays-container">
          {/* Weekdays */}
          {mergedOptions.type !== HeatMapCalendarType.WEEKLY && (
            <div className="weekdays">
              {mergedOptions.i18n?.weekdays?.map((weekday, index) => (
                <span key={index}>{weekday}</span>
              ))}
            </div>
          )}

          {/* Months */}
          <div className="months-container">
            {/* Yearly */}
            {mergedOptions.type === HeatMapCalendarType.YEARLY && (
              <div className="months">
                {mergedOptions.i18n?.months?.map((month, index) => (
                  <span key={index}>{month}</span>
                ))}
              </div>
            )}

            {/* Monthly */}
            {mergedOptions.type === HeatMapCalendarType.MONTHLY && (
              <div className="months">
                <span className="centered">
                  {calendarUtilsRef.current.getLocalizedMonthName(
                    mergedOptions.startDate,
                    mergedOptions.locale
                  )}
                </span>
              </div>
            )}

            {/* Calendar Grid */}
            <div
              className={`heatmap-grid ${
                mergedOptions.type === HeatMapCalendarType.MONTHLY
                  ? 'monthly'
                  : ''
              }`}
            >
              {/* First Week Empty Days */}
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

              {/* Available Days */}
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

              {/* Last Week Empty Days */}
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

      {/* Footer */}
      {mergedOptions.heatmapLegend?.display && (
        <div className="footer">
          {/* Footer Content */}
          <div className="footer-content">{footerContent && footerContent}</div>

          {/* Heatmap Legend */}
          <div className="legend">
            <NxHeatmapLegend
              options={mergedOptions}
              min={min}
              max={max}
              range={range}
              step={step}
              levels={levels}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NxCalendarHeatmap;
