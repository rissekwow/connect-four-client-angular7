import { NgModule } from "@angular/core";
import { GamePanelComponent } from "./game-panel.component";
import { ConnectFourPlaygroundComponent } from "./connect-four-playground/connect-four-playground.component";
import { ConfPanelComponent } from "./conf-panel/conf-panel.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        GamePanelComponent,
        ConnectFourPlaygroundComponent,
        ConfPanelComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ]
})
export class GamePanelModule {

}