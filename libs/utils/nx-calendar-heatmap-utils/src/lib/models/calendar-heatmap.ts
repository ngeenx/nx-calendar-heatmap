import { DateTime } from "luxon";

export enum HeatMapCalendarType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface IHeatmapColor {
  min: number;
  max: number;
  isDefault: boolean;
  className: string;
}

export interface IHeatmapDay {
  date: DateTime;
  count: number;
}

export interface ICalendarHeatmapOptions {
  // options
  type: HeatMapCalendarType;
  startDate: DateTime;
  cellSize?: number;
  colors?: IHeatmapColor[] | null;
  hideEmptyDays?: boolean;

  // events
  onClick?: (day: IHeatmapDay) => void;
}
