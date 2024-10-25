import tippy, { Props } from "tippy.js";
import { IHeatmapColor } from "../models/calendar-heatmap";
import { TippyUtils } from "./tippy.utils";

export class LevelsTippyUtils extends TippyUtils {
  /**
   * Lazy load tooltip content
   *
   * @param event - mouse event
   * @param heatmapColor - hovered heatmap color item
   */
  public lazyLoadTooltip = (
    event: MouseEvent,
    heatmapColor: IHeatmapColor
  ): void => {
    if (this.tippySingletonInstance) {
      const tooltipContent = this.getTooltipContent(heatmapColor);

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
   * @param heatmapColor - selected heatmap color
   * @returns HTML string
   */
  private readonly getTooltipContent = (
    heatmapColor: IHeatmapColor
  ): string | null => {
    if (this.options.showTooltip) {
      if (this.options.heatmapLevels?.tooltipFormatter) {
        return this.options.heatmapLevels.tooltipFormatter(heatmapColor);
      }

      if (heatmapColor.min === heatmapColor.max) {
        return `${this.options.i18n?.min}: ${heatmapColor.min} ${this.options.tooltipUnit}`;
      }

      return `${this.options.i18n?.min}: ${heatmapColor.min} - ${this.options.i18n?.max}: ${heatmapColor.max}`;
    }

    return null;
  };
}
