import { DateTime } from "luxon";

export enum HeatMapCalendarType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export interface IHeatmapColor {
  min: number | undefined;
  max: number | undefined;
  isDefault: boolean | undefined;
  className: string;
}

export interface IHeatmapDay {
  date: DateTime;
  count?: number;
  data?: unknown;
}

export interface ILocale {
  // calendar
  months?: string[];
  weekdays?: string[];
  on?: string;
  less?: string;
  more?: string;
  noData?: string;

  // levels
  min?: string;
  max?: string;
}

export enum HeatmapLevelsDirection {
  LEFT = "left",
  RIGHT = "right",
}

export interface IHeatmapLevels {
  display?: boolean;
  direction?: HeatmapLevelsDirection;
  tooltipFormatter?: (color: IHeatmapColor) => string;
}

export interface ICalendarHeatmapOptions {
  // options
  type: HeatMapCalendarType;
  startDate: DateTime;
  cellSize?: number;
  colors?: IHeatmapColor[] | null;
  hideEmptyDays?: boolean;

  // levels
  heatmapLevels?: IHeatmapLevels;

  // locale
  locale?: string;
  i18n?: ILocale;

  // tooltip
  showTooltip?: boolean;
  tooltipUnit?: string;
  tooltipDateFormat?: string;
  tooltipFormatter?: (day: IHeatmapDay, unit: string) => string;

  // events
  onClick?: (day: IHeatmapDay) => void;
}
