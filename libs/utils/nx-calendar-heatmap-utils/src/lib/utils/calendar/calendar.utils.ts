import { DateTime } from "luxon";
import {
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapDay,
} from "../../models/calendar-heatmap";

export class CalendarUtils {
  public constructor(public readonly options: ICalendarHeatmapOptions) {}

  /**
   * Calculate the number of empty cells before the first date
   *
   * @param startDate - The start date (luxon)
   */
  public calculateFirstWeekOffset(startDate: DateTime): IHeatmapDay[] {
    // Luxon: 1 = Monday, 7 = Sunday
    const weekday = startDate.weekday;

    // Sunday (7) needs 6 empty cells, Monday (1) needs 0
    return Array.from(
      { length: weekday === 7 ? 6 : weekday - 1 },
      (_, i) =>
        <IHeatmapDay>{
          date: startDate.minus({ days: i }),
          count: undefined,
          data: i,
        }
    );
  }

  /**
   * Calculate the number of empty cells after the last date
   *
   * @param endDate - The end date (luxon)
   */
  public calculateLastWeekOffset(endDate: DateTime): IHeatmapDay[] {
    // Luxon: 1 = Monday, 7 = Sunday
    const weekday = endDate.weekday;

    // Sunday (7) needs 0 empty cells, Monday (1) needs 6
    return Array.from(
      { length: weekday === 7 ? 0 : 7 - weekday },
      (_, i) =>
        <IHeatmapDay>{
          date: endDate.plus({ days: i }),
          count: undefined,
          data: i,
        }
    );
  }

  /**
   * Return an array of 12 localized month names, starting from the current year
   *
   * @param locale - The locale to use for localization
   * @returns An array of 12 localized month names
   */
  public getLocalizedMonthNames(
    locale = this.options.locale ?? "en"
  ): string[] {
    const months = Array.from({ length: 12 }, (_, i) => i).map(
      (value: number): string =>
        this.getLocalizedMonthName(
          DateTime.local(this.options.startDate.year, value + 1, 1),
          locale
        )
    );

    return months;
  }

  /**
   * Return a localized month name for a given date
   *
   * @param date - The date to get the localized month name for
   * @param locale - The locale to use for localization
   * @returns A localized month name
   */
  public getLocalizedMonthName(date: DateTime, locale = "en"): string {
    return date.setLocale(locale).toFormat("LLLL");
  }

  /**
   * Return an array of 7 localized weekday names, starting from Monday to Sunday
   *
   * @param locale - The locale to use for localization
   * @returns An array of 7 localized weekday names
   */
  public getLocalizedWeekdayNames(
    locale = this.options.locale ?? "en"
  ): string[] {
    const weekDays: string[] = [],
      date = DateTime.now().setLocale(locale);

    for (let i = 1 as const; i <= 7; i++) {
      const day = date.set({ weekday: i }).toLocaleString({ weekday: "short" });

      weekDays.push(day);
    }

    return weekDays;
  }

  /**
   * Return the grid position of a day in the calendar grid as CSS properties
   *
   * @param index - The index of the day
   * @param firstWeekOffsetDayLength - The number of empty cells before the first date
   * @returns An object with the grid position as CSS properties
   */
  public getGridPositionOfDay = (
    index: number,
    firstWeekOffsetDayLength: number
  ): object => {
    if (this.options.type === HeatMapCalendarType.WEEKLY) {
      return {
        gridRow: 1,
        gridColumn: index + 1,
        height: (this.options.cellSize ?? 15) + "px",
        width: (this.options.cellSize ?? 15) + "px",
        ...this.options.overWritedDayStyle,
      };
    } else {
      return {
        gridRow: ((index + firstWeekOffsetDayLength) % 7) + 1,
        gridColumn: Math.floor((index + firstWeekOffsetDayLength) / 7) + 1,
        height: (this.options.cellSize ?? 15) + "px",
        width: (this.options.cellSize ?? 15) + "px",
        ...this.options.overWritedDayStyle,
      };
    }
  };
}
