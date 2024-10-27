import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DateTime } from "luxon";
import { YearlyViewComponent } from "./components/yearly-view/yearly-view.component";
import { IHeatmapColor } from "@ngeenx/nx-calendar-heatmap-utils";
import { MonthlyViewComponent } from "./components/monthly-view/monthly-view.component";

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, YearlyViewComponent, MonthlyViewComponent],
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  selectedColorVariant: IHeatmapColor[] = [];
  selectedYear: number = DateTime.now().year;
  selectedHeatmapLevelState = true;
  selectedLocale = "en";

  years: number[] = Array.from({ length: 30 }, (_, i) => i + 1998).reverse();
  locales: string[] = ["en", "tr", "fr", "de", "ja", "zh"];
  heatmapLevelDisplayOptions: boolean[] = [true, false];

  heatmapColorsVariants: IHeatmapColor[][] = [
    [
      {
        min: Number.NEGATIVE_INFINITY,
        max: 0,
        isDefault: true,
        className: "custom-variant1-level-0",
      },
      {
        min: 1,
        max: 10,
        isDefault: false,
        className: "custom-variant1-level-1",
      },
      {
        min: 10,
        max: 30,
        isDefault: false,
        className: "custom-variant1-level-2",
      },
      {
        min: 30,
        max: 40,
        isDefault: false,
        className: "custom-variant1-level-3",
      },
      {
        min: 40,
        max: 50,
        isDefault: false,
        className: "custom-variant1-level-4",
      },
      {
        min: 50,
        max: Number.POSITIVE_INFINITY,
        isDefault: false,
        className: "custom-variant1-level-5",
      },
    ],
    [
      {
        min: Number.NEGATIVE_INFINITY,
        max: 0,
        isDefault: true,
        className: "custom-variant2-level-0",
      },
      {
        min: 1,
        max: 10,
        isDefault: false,
        className: "custom-variant2-level-1",
      },
      {
        min: 10,
        max: 30,
        isDefault: false,
        className: "custom-variant2-level-2",
      },
      {
        min: 30,
        max: 40,
        isDefault: false,
        className: "custom-variant2-level-3",
      },
      {
        min: 40,
        max: 50,
        isDefault: false,
        className: "custom-variant2-level-4",
      },
      {
        min: 50,
        max: Number.POSITIVE_INFINITY,
        isDefault: false,
        className: "custom-variant2-level-5",
      },
    ],
    [
      {
        min: Number.NEGATIVE_INFINITY,
        max: 0,
        isDefault: true,
        className: "custom-variant3-level-0",
      },
      {
        min: 1,
        max: 10,
        isDefault: false,
        className: "custom-variant3-level-1",
      },
      {
        min: 10,
        max: 30,
        isDefault: false,
        className: "custom-variant3-level-2",
      },
      {
        min: 30,
        max: 40,
        isDefault: false,
        className: "custom-variant3-level-3",
      },
      {
        min: 40,
        max: 50,
        isDefault: false,
        className: "custom-variant3-level-4",
      },
      {
        min: 50,
        max: Number.POSITIVE_INFINITY,
        isDefault: false,
        className: "custom-variant3-level-5",
      },
    ],
    [
      {
        min: Number.NEGATIVE_INFINITY,
        max: 0,
        isDefault: true,
        className: "custom-variant4-level-0",
      },
      {
        min: 1,
        max: 10,
        isDefault: false,
        className: "custom-variant4-level-1",
      },
      {
        min: 10,
        max: 30,
        isDefault: false,
        className: "custom-variant4-level-2",
      },
      {
        min: 30,
        max: 40,
        isDefault: false,
        className: "custom-variant4-level-3",
      },
      {
        min: 40,
        max: 50,
        isDefault: false,
        className: "custom-variant4-level-4",
      },
      {
        min: 50,
        max: Number.POSITIVE_INFINITY,
        isDefault: false,
        className: "custom-variant4-level-5",
      },
    ],
  ];

  onColorVariantChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const colorVariant = this.heatmapColorsVariants.find((variant) =>
      variant.some((color) => color.className === selectedValue)
    );

    this.selectedColorVariant = colorVariant ? colorVariant : [];
  }
}
