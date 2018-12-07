import { NgModule } from "@angular/core";
import { SidenavMenuComponent } from "./sidenav-menu/sidenav-menu.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { GamePanelService } from "../game-panel/service/game-panel.service";
import { CanvasPaintService } from "../game-panel/service/canvas-paint.service";
import { WebsocketService } from "../game-panel/service/websocket-service";

@NgModule( {
    declarations: [
        SidenavMenuComponent
    ],
    imports: [ 
        BrowserModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        RouterModule,
        FormsModule
    ],
    exports: [
        SidenavMenuComponent
    ],
    providers: [
        GamePanelService,
        CanvasPaintService,
        WebsocketService
    ]
})
export class CoreModule {

}