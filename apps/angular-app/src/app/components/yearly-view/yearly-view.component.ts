import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { NxHeatmapCalendarComponent } from "@ngeenx/nx-angular-calendar-heatmap";
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  HeatmapLevelsDirection,
} from "@ngeenx/nx-calendar-heatmap-utils";
import { DateTime } from "luxon";
import { CalendarFooterHintComponent } from "../calendar-footer-hint/calendar-footer-hint.component";

@Component({
  selector: "app-yearly-view",
  templateUrl: "./yearly-view.component.html",
  standalone: true,
  imports: [NxHeatmapCalendarComponent, CalendarFooterHintComponent],
})
export class YearlyViewComponent implements OnInit, OnChanges {
  @Input() selectedColorVariant: IHeatmapColor[] = [];
  @Input() selectedYear: number = DateTime.now().year;
  @Input() selectedHeatmapLevelState = true;
  @Input() selectedLocale = "en";

  startDate: DateTime = DateTime.now().startOf("year");
  heatmapData: IHeatmapDay[] = [];
  options: ICalendarHeatmapOptions;

  constructor() {
    this.options = this.getOptions();
  }

  ngOnInit(): void {
    this.heatmapData = this.generateHeatmapData(this.startDate);
  }

  ngOnChanges(): void {
    this.startDate = DateTime.fromObject({ year: this.selectedYear }).startOf(
      "year"
    );
    this.heatmapData = this.generateHeatmapData(this.startDate);

    this.options = this.getOptions();
  }

  public onDayClick(day: IHeatmapDay): void {
    console.log(`Clicked on ${day.date.toISODate()} with value ${day.count}`);
  }

  private generateHeatmapData(startDate: DateTime): IHeatmapDay[] {
    const endDate = startDate.endOf("year");
    const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
    const heatmap: IHeatmapDay[] = [];

    let currentDate = startDate;

    for (let i = 0; i <= daysBetween; i++) {
      const day: IHeatmapDay = {
        date: currentDate,
        count: Math.floor(Math.random() * 101),
      };

      heatmap.push(day);

      currentDate = currentDate.plus({ days: 1 });
    }

    return heatmap;
  }

  private getOptions(): ICalendarHeatmapOptions {
    return {
      type: HeatMapCalendarType.YEARLY,
      startDate: this.startDate,
      cellSize: 15,
      hideEmptyDays: false,
      locale: this.selectedLocale,
      colors: this.selectedColorVariant,
      heatmapLegend: {
        display: this.selectedHeatmapLevelState,
        direction: HeatmapLevelsDirection.RIGHT,
      },
      onClick: (day: IHeatmapDay) => this.onDayClick(day),
    };
  }
}
