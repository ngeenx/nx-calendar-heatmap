import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from "@angular/core";
import { NxHeatmapCalendarComponent } from "@ngeenx/nx-angular-calendar-heatmap";
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  HeatmapLevelsDirection,
} from "@ngeenx/nx-calendar-heatmap-utils";
import { DateTime } from "luxon";

@Component({
  selector: "app-yearly-view",
  templateUrl: "./yearly-view.component.html",
  standalone: true,
  imports: [NxHeatmapCalendarComponent],
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
    this.options = {
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

  ngOnInit(): void {
    this.heatmapData = this.generateHeatmapData(this.startDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["selectedYear"] ||
      changes["selectedColorVariant"] ||
      changes["selectedHeatmapLevelState"] ||
      changes["selectedLocale"]
    ) {
      this.startDate = DateTime.fromObject({ year: this.selectedYear }).startOf(
        "year"
      );
      console.log("this.startDate", this.startDate.toFormat("yyyy-MM-dd"));
      this.heatmapData = this.generateHeatmapData(this.startDate);

      this.options = {
        ...this.options,
        startDate: this.startDate,
        colors: this.selectedColorVariant,
        locale: this.selectedLocale,
        heatmapLegend: {
          ...this.options.heatmapLegend,
          display: this.selectedHeatmapLevelState,
        },
      };
    }
  }

  onDayClick(day: IHeatmapDay): void {
    console.log(`Clicked on ${day.date.toISODate()} with value ${day.count}`);
  }

  private generateHeatmapData(startDate: DateTime): IHeatmapDay[] {
    const endDate = startDate.endOf("year");
    const daysBetween = Math.floor(endDate.diff(startDate, "days").days);
    const heatmap: IHeatmapDay[] = [];

    console.log("endDate", endDate.toFormat("yyyy-MM-dd"));

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
}
