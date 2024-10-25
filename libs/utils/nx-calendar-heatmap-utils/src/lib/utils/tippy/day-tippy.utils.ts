import tippy, { Props } from "tippy.js";
import { IHeatmapDay } from "../../models/calendar-heatmap";
import { TippyUtils } from "./tippy.utils";

export class DayTippyUtils extends TippyUtils {
  /**
   * Lazy load tooltip content
   *
   * @param event - mouse event
   * @param day - hovered day item
   */
  public lazyLoadTooltip = (event: MouseEvent, day: IHeatmapDay): void => {
    if (this.tippySingletonInstance) {
      const tooltipContent = this.getTooltipContent(day);

      if (tooltipContent) {
        const instance = this.tippyInstances.get(event.target as HTMLElement);

        if (instance) {
          instance.setContent(tooltipContent);
        } else if (!instance) {
          this.tippyInstances.set(
            event.target as HTMLElement,
            tippy(
              event.target as HTMLElement,
              {
                content: tooltipContent,
                ...(this.options?.tippyProps as Props as object),
              } as Props
            )
          );

          this.tippySingletonInstance.setInstances(
            Array.from(this.tippyInstances.values())
          );
        }
      }
    }
  };

  /**
   * Generate tooltip content
   *
   * @param day - selected day
   * @returns HTML string
   */
  private readonly getTooltipContent = (day: IHeatmapDay): string | null => {
    if (this.options.tooltip?.display) {
      // has value
      if (day?.count !== undefined) {
        // format with custom formatter
        if (this.options.tooltip?.tooltipFormatter) {
          return this.options.tooltip.tooltipFormatter(
            day,
            this.options.tooltip.unit ?? "contributions"
          );
        }

        // default tooltip content
        return `<b>${day.count}</b> ${this.options.tooltip.unit} ${
          this.options.i18n?.on
        } ${day.date.toFormat(this.options.tooltip.dateFormat ?? "MMMM d")}`;
      } else if (this.options.i18n?.noData) {
        // no data
        return `${this.options.i18n?.noData} ${this.options.tooltip.unit} ${
          this.options.i18n?.on
        } ${day.date.toFormat(this.options.tooltip.dateFormat ?? "MMMM d")}`;
      }
    }

    return null;
  };
}
