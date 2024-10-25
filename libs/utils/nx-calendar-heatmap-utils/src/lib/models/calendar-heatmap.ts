import { DateTime } from "luxon";
import { Props } from "tippy.js";

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

export interface IHeatmapLegend {
  display?: boolean;
  direction?: HeatmapLevelsDirection;
  tooltipFormatter?: (color: IHeatmapColor) => string;
}

export interface IHeatmapTooltip {
  display?: boolean;
  unit?: string;
  dateFormat?: string;
  tooltipFormatter?: (day: IHeatmapDay, unit: string) => string;
}

export interface ICalendarHeatmapOptions {
  // options
  type: HeatMapCalendarType;
  startDate: DateTime;
  cellSize?: number;
  colors?: IHeatmapColor[] | null;
  hideEmptyDays?: boolean;
  overWritedDayStyle?: object;

  // levels
  heatmapLegend?: IHeatmapLegend;

  // locale
  locale?: string;
  i18n?: ILocale;

  // tooltip
  tippyProps?: Props | object;
  tooltip?: IHeatmapTooltip;

  // events
  onClick?: (day: IHeatmapDay) => void;
}
