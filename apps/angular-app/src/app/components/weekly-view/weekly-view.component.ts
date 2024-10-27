import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { NxHeatmapCalendarComponent } from "@ngeenx/nx-angular-calendar-heatmap";
import {
  IHeatmapColor,
  IHeatmapDay,
  ICalendarHeatmapOptions,
  HeatMapCalendarType,
  HeatmapLevelsDirection,
} from "@ngeenx/nx-calendar-heatmap-utils";
import { DateTime } from "luxon";

@Component({
  selector: "app-weekly-view",
  templateUrl: "./weekly-view.component.html",
  standalone: true,
  imports: [NxHeatmapCalendarComponent],
})
export class WeeklyViewComponent implements OnInit, OnChanges {
  @Input() selectedColorVariant: IHeatmapColor[] = [];
  @Input() selectedYear: number = DateTime.now().year;
  @Input() selectedHeatmapLevelState = true;
  @Input() selectedLocale = "en";

  heatmapData: IHeatmapDay[] = [];
  options!: ICalendarHeatmapOptions;

  ngOnInit(): void {
    this.options = this.getOptions();

    this.generateHeatmapData();
  }

  ngOnChanges(): void {
    this.options = this.getOptions();

    this.generateHeatmapData();
  }

  private generateHeatmapData(): void {
    const startDate = DateTime.fromObject({
      year: this.selectedYear,
      month: 1,
      day: 1,
    });
    const endDate = startDate.plus({ days: 6 });

    const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
    this.heatmapData = [];

    let currentDate = startDate;

    for (let i = 0; i <= daysBetween; i++) {
      const day: IHeatmapDay = {
        date: currentDate,
        count: Math.floor(Math.random() * 101), // Random count for demonstration
      };
      this.heatmapData.push(day);
      currentDate = currentDate.plus({ days: 1 });
    }
  }

  onDayClick(day: IHeatmapDay): void {
    console.log(`Clicked on ${day.date.toISODate()} with value ${day.count}`);
  }

  public getOptions(): ICalendarHeatmapOptions {
    return {
      type: HeatMapCalendarType.WEEKLY,
      cellSize: 15,
      hideEmptyDays: false,
      colors: this.selectedColorVariant,
      onClick: this.onDayClick,
      tippyProps: {
        placement: "bottom",
      },
      heatmapLegend: {
        direction: HeatmapLevelsDirection.LEFT,
        display: this.selectedHeatmapLevelState,
      },
      locale: this.selectedLocale,
    } as ICalendarHeatmapOptions;
  }
}
