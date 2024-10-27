import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NxHeatmapCalendarComponent } from "@ngeenx/nx-angular-calendar-heatmap";

@Component({
  standalone: true,
  imports: [RouterModule, NxHeatmapCalendarComponent],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "/libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss",
  ],
})
export class AppComponent {
  title = "angular-app";
}
