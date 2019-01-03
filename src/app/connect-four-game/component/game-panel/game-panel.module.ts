import { NgModule } from "@angular/core";
import { GamePanelComponent } from "./game-panel.component";
import { ConnectFourPlaygroundComponent } from "./connect-four-playground/connect-four-playground.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { GameConfigurationComponent } from "./game-configuration/game-configuration.component";

@NgModule({
    declarations: [
        GamePanelComponent,
        ConnectFourPlaygroundComponent,
        GameConfigurationComponent
    ],
    imports: [
        BrowserModule,
        FormsModule
    ]
})
export class GamePanelModule {

}