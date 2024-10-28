import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { NxCalendarHeatmapComponent } from "@ngeenx/nx-angular-calendar-heatmap";
import {
  IHeatmapColor,
  IHeatmapDay,
  ICalendarHeatmapOptions,
  HeatMapCalendarType,
  HeatmapLevelsDirection,
} from "@ngeenx/nx-calendar-heatmap-utils";
import { DateTime } from "luxon";

@Component({
  selector: "app-monthly-view",
  templateUrl: "./monthly-view.component.html",
  imports: [NxCalendarHeatmapComponent],
  standalone: true,
})
export class MonthlyViewComponent implements OnInit, OnChanges {
  @Input() selectedColorVariant: IHeatmapColor[] = [];
  @Input() selectedYear: number = DateTime.now().year;
  @Input() selectedHeatmapLevelState = true;
  @Input() selectedLocale = "en";

  private options: ICalendarHeatmapOptions;
  private months: DateTime[] = [];
  public calendars: any[] = [];
  private montlyHeatmapData: IHeatmapDay[][] = [];

  public constructor() {
    this.options = this.getOptions();
  }

  public ngOnInit(): void {
    this.generateHeatmapDataForYear();
  }

  public ngOnChanges(): void {
    this.options = this.getOptions();

    this.generateHeatmapDataForYear();
  }

  private generateHeatmapDataForYear(): void {
    this.months = Array.from({ length: 12 }, (_, i) =>
      DateTime.local().set({ year: this.selectedYear, month: i + 1, day: 1 })
    );

    this.montlyHeatmapData = this.months.map((monthStartDate) =>
      this.generateHeatmapData(monthStartDate)
    );

    this.calendars = this.montlyHeatmapData.map((monthData) => ({
      config: { ...this.options, startDate: monthData[0].date },
      data: monthData,
    }));
  }

  private generateHeatmapData(startDate: DateTime): IHeatmapDay[] {
    const endDate = startDate.endOf("month");
    const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
    const monthData: IHeatmapDay[] = [];
    let currentDate = startDate;

    for (let i = 0; i <= daysBetween; i++) {
      const day: IHeatmapDay = {
        date: currentDate,
        count: Math.floor(Math.random() * 101), // Random count for demonstration
      };
      monthData.push(day);
      currentDate = currentDate.plus({ days: 1 });
    }
    return monthData;
  }

  private onDayClick(day: IHeatmapDay): void {
    console.log(`Clicked on ${day.date.toISODate()} with value ${day.count}`);
  }

  private getOptions(): any {
    return {
      type: HeatMapCalendarType.MONTHLY,
      cellSize: 15,
      hideEmptyDays: false,
      colors: this.selectedColorVariant,
      heatmapLegend: {
        display: this.selectedHeatmapLevelState,
        direction: HeatmapLevelsDirection.RIGHT,
      },
      overWritedDayStyle: { borderRadius: "50%" },
      locale: this.selectedLocale,
      onClick: (day: IHeatmapDay) => this.onDayClick(day),
    };
  }
}
