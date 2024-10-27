import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {
  ICalendarHeatmapOptions,
  IHeatmapColor,
  LevelsTippyUtils,
} from "@ngeenx/nx-calendar-heatmap-utils";

@Component({
  selector: "nx-heatmap-calendar-legend",
  templateUrl: "./nx-calendar-legend.component.html",
  standalone: true,
  imports: [CommonModule],
})
export class NxHeatmapCalendarLegendComponent implements OnInit, OnDestroy {
  @Input() options!: ICalendarHeatmapOptions;
  @Input() min = 0;
  @Input() max = 100;
  @Input() range = 100;
  @Input() step = 20;
  @Input() levels = 5;

  public colors: IHeatmapColor[] = [];
  private tippyUtils?: LevelsTippyUtils;

  ngOnInit(): void {
    this.updateLevelMap();
    this.tippyUtils = new LevelsTippyUtils(this.options);
    this.tippyUtils.init();
  }

  ngOnDestroy(): void {
    this.tippyUtils?.destroy();
  }

  private updateLevelMap(): void {
    if (this.options.colors?.length) {
      this.colors = this.options.colors;
    } else {
      this.colors = Array.from({ length: this.levels }, (_, i) => ({
        min: i * this.step,
        max: i * this.step,
        isDefault: false,
        className: `level-${i}`,
      }));
    }
  }

  getDayClass(value: number | undefined): string {
    if (!this.options.colors?.length) {
      if (value === 0 || value === undefined) return "level-0";

      for (let i = 0; i < this.levels; i++) {
        if (value <= this.min + this.step * (i + 1)) return `level-${i + 1}`;
      }
      return "level-0";
    }

    if (value !== undefined) {
      for (const color of this.options.colors) {
        if (color.min && color.max && value >= color.min && value <= color.max)
          return color.className;
      }
    }

    const defaultColor =
      this.options.colors?.find((color: IHeatmapColor) => color.isDefault) ||
      this.options.colors?.[0];
    return defaultColor ? defaultColor.className : "level-0";
  }

  onMouseOver(event: MouseEvent, color: IHeatmapColor): void {
    this.tippyUtils?.lazyLoadTooltip(event, color);
  }
}
