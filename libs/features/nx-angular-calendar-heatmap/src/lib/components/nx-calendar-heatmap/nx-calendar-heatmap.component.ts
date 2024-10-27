import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateTime } from "luxon";
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
  DayTippyUtils,
  HeatmapLevelsDirection,
  CalendarUtils,
} from "@ngeenx/nx-calendar-heatmap-utils";
import { NxHeatmapCalendarLegendComponent } from "../nx-calendar-legend/nx-calendar-legend.component";

const defaultOptions: ICalendarHeatmapOptions = {
  type: HeatMapCalendarType.YEARLY,
  startDate: DateTime.now().startOf("year"),
  locale: "en",
  tooltip: {
    display: true,
    unit: "contribution",
    dateFormat: "MMMM d",
  },
  tippyProps: { placement: "top" },
  heatmapLegend: {
    display: true,
    direction: HeatmapLevelsDirection.RIGHT,
  },
  i18n: {
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    months: [],
    on: "on",
    less: "less",
    more: "more",
    noData: "No",
    min: "min",
    max: "max",
  },
};

@Component({
  imports: [CommonModule, NxHeatmapCalendarLegendComponent],
  selector: "nx-heatmap-calendar",
  templateUrl: "./nx-calendar-heatmap.component.html",
  standalone: true,
})
export class NxHeatmapCalendarComponent implements OnInit, OnDestroy {
  @Input() options: ICalendarHeatmapOptions = {} as ICalendarHeatmapOptions;
  @Input() heatmapData: IHeatmapDay[] = [];

  public HeatMapCalendarType: typeof HeatMapCalendarType = HeatMapCalendarType;

  levels = 5;
  min = 0;
  max = 0;
  range = 0;
  step = 0;

  emptyCellStyle: any = {} as any;

  mergedOptions: ICalendarHeatmapOptions = {} as ICalendarHeatmapOptions;
  firstWeekOffsetDays: IHeatmapDay[] = [];
  lastWeekOffsetDays: IHeatmapDay[] = [];
  calendarUtils = new CalendarUtils(defaultOptions);
  tippyUtils: DayTippyUtils | undefined;

  ngOnInit() {
    this.mergedOptions = { ...defaultOptions, ...this.options };
    this.updateHeatmapData();
    this.tippyUtils = new DayTippyUtils(this.mergedOptions);
    this.tippyUtils.init();
  }

  ngOnDestroy() {
    this.tippyUtils?.destroy();
  }

  updateHeatmapData() {
    this.calendarUtils = new CalendarUtils(this.mergedOptions);

    if (this.mergedOptions.i18n) {
      this.mergedOptions.i18n.months =
        this.calendarUtils.getLocalizedMonthNames(this.mergedOptions.locale);
      this.mergedOptions.i18n.weekdays =
        this.calendarUtils.getLocalizedWeekdayNames(this.mergedOptions.locale);
    }

    this.emptyCellStyle = {
      height: `${this.mergedOptions.cellSize || 15}px`,
      width: `${this.mergedOptions.cellSize || 15}px`,
      ...this.mergedOptions.overWritedDayStyle,
    };

    this.levels = this.mergedOptions.colors?.length || 5;
    this.range = 100;
    this.step = this.range / this.levels;

    const { type, startDate } = this.mergedOptions;
    let endDate;

    switch (type) {
      case HeatMapCalendarType.WEEKLY:
        endDate = startDate.plus({ days: 6 });
        break;
      case HeatMapCalendarType.MONTHLY:
        endDate = startDate.endOf("month");
        break;
      case HeatMapCalendarType.YEARLY:
        endDate = startDate.endOf("year");
        break;
    }

    if (type !== HeatMapCalendarType.WEEKLY) {
      this.firstWeekOffsetDays =
        this.calendarUtils.calculateFirstWeekOffset(startDate);
      this.lastWeekOffsetDays =
        this.calendarUtils.calculateLastWeekOffset(endDate);
    }
  }

  getGridPosition(index: number): object {
    return this.calendarUtils.getGridPositionOfDay(
      index,
      this.firstWeekOffsetDays.length
    );
  }

  getDayClass(value: number | undefined): string {
    const baseClasses = `${this.mergedOptions.onClick ? "clickable" : ""}`;

    if (!this.mergedOptions.colors?.length) {
      if (value === 0 || value === undefined) return `${baseClasses} level-0`;

      for (let i = 0; i < this.levels; i++) {
        if (value <= this.min + this.step * (i + 1))
          return `${baseClasses} level-${i + 1}`;
      }
      return `${baseClasses} level-0`;
    }

    if (value !== undefined) {
      for (const color of this.mergedOptions.colors) {
        if (color.min && color.max && value >= color.min && value <= color.max)
          return color.className;
      }
    }

    const defaultColor =
      this.mergedOptions.colors?.find(
        (color: IHeatmapColor) => color.isDefault
      ) || this.mergedOptions.colors?.[0];
    return defaultColor ? defaultColor.className : `${baseClasses} level-0`;
  }

  getEmptyDayClass(): string {
    const defaultColor = this.mergedOptions.colors?.find(
      (color) => color.isDefault
    ) || { className: "level-0" };
    return defaultColor.className;
  }

  onDayClick(day: IHeatmapDay) {
    if (this.mergedOptions.onClick) this.mergedOptions.onClick(day);
  }

  onDayMouseOver(event: MouseEvent, day: IHeatmapDay) {
    this.tippyUtils?.lazyLoadTooltip(event, day);
  }
}
