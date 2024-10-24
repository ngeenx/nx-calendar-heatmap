import tippy, {
  createSingleton,
  CreateSingletonInstance,
  Instance,
  Props,
} from "tippy.js";
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
} from "../models/calendar-heatmap";

export class TippyUtils {
  public tippySingletonInstance?: CreateSingletonInstance;
  public tippyInstances = new Map<HTMLElement, Instance>();

  public constructor(private readonly options: ICalendarHeatmapOptions) {}

  /**
   * Init tippy.js singleton and instances
   */
  public init = (): void => {
    this.tippyInstances.clear();

    if (this.tippySingletonInstance) {
      this.tippySingletonInstance.setInstances(
        Array.from(this.tippyInstances.values())
      );
    } else {
      this.tippySingletonInstance = createSingleton(
        Array.from(this.tippyInstances.values()),
        {
          overrides: [],
          moveTransition: "transform 0.1s ease-out",
          allowHTML: true,
        }
      );
    }
  };

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
    if (this.options.showTooltip) {
      // has value
      if (day?.count !== undefined) {
        // format with custom formatter
        if (this.options.tooltipFormatter) {
          return this.options.tooltipFormatter(
            day,
            this.options.tooltipUnit ?? "contributions"
          );
        }

        // default tooltip content
        return `<b>${day.count}</b> ${this.options.tooltipUnit} ${
          this.options.i18n?.on
        } ${day.date.toFormat(this.options.tooltipDateFormat ?? "MMMM d")}`;
      } else if (this.options.i18n?.noData) {
        // no data
        return `${this.options.i18n?.noData} ${this.options.tooltipUnit} ${
          this.options.i18n?.on
        } ${day.date.toFormat(this.options.tooltipDateFormat ?? "MMMM d")}`;
      }
    }

    return null;
  };

  /**
   * Destroy tippy.js singleton and tippy instances
   */
  public destroy = (): void => {
    this.tippySingletonInstance?.destroy();
    this.tippyInstances?.forEach((item: Instance<Props>) => item.destroy());
  };
}
