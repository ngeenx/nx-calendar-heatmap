import {
  createSingleton,
  CreateSingletonInstance,
  Instance,
  Props,
} from "tippy.js";
import { ICalendarHeatmapOptions } from "../../models/calendar-heatmap";

export class TippyUtils {
  public tippySingletonInstance?: CreateSingletonInstance;
  public tippyInstances = new Map<HTMLElement, Instance>();

  public constructor(public readonly options: ICalendarHeatmapOptions) {}

  /**
   * Init tippy.js singleton and instances
   */
  public init(): void {
    this.tippyInstances?.clear();

    if (this.tippySingletonInstance) {
      this.tippySingletonInstance.setInstances(
        Array.from(this.tippyInstances.values())
      );
    } else {
      this.tippySingletonInstance = createSingleton(
        Array.from(this.tippyInstances.values()),
        {
          moveTransition: "transform 0.1s ease-out",
          allowHTML: true,
          ...(this.options.tippyProps as object),
        }
      );
    }
  }

  public reset(): void {
    this.tippyInstances?.clear();
    this.tippySingletonInstance?.setInstances([]);
  }

  /**
   * Destroy tippy.js singleton and tippy instances
   */
  public destroy(): void {
    this.tippySingletonInstance?.destroy();
    this.tippyInstances?.forEach((item: Instance<Props>) => item.destroy());
  }
}
