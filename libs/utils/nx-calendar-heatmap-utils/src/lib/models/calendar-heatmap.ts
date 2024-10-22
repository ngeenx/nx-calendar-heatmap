import { DateTime } from "luxon";

export enum HeatmapColorType {
  STYLE = "style",
  CLASS_NAME = "class-name",
}

export enum HeatMapCalendarType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface IHeatmapColor {
  min?: number;
  max?: number;
  color: string;
  type: HeatmapColorType;
}

export interface IHeatmapDay {
  date: DateTime;
  count: number;
}

export interface ICalendarHeatmapOptions {
  // options
  type: HeatMapCalendarType;
  startDate: string;
  cellSize?: number;
  colors?: IHeatmapColor[];
  hideEmptyDays?: boolean;

  // events
  onClick?: (day: IHeatmapDay) => void;
}
