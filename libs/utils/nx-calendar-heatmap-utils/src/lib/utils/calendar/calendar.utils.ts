import { DateTime } from "luxon";
import { IHeatmapDay } from "../../models/calendar-heatmap";

export class CalendarUtils {
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
}
