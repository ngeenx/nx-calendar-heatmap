import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "/libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss",
  ],
})
export class AppComponent {
  title = "angular-app";
}
