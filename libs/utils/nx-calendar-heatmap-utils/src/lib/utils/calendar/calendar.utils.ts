import { DateTime } from "luxon";
import {
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

  public getLocalizedMonthName(date: DateTime, locale = "en"): string {
    return date.setLocale(locale).toFormat("LLLL");
  }

  public getLocalizedWeekdayNames(
    locale = this.options.locale ?? "en"
  ): string[] {
    const weekDays: string[] = [];
    const dt = DateTime.now().setLocale(locale);

    for (let i = 1 as const; i <= 7; i++) {
      const day = dt.set({ weekday: i }).toLocaleString({ weekday: "short" });
      weekDays.push(day);
    }

    return weekDays;
  }
}
