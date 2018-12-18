import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SidenavMenuComponent } from "../component/sidenav-menu/sidenav-menu.component";
import { WebsocketService } from "../service/websocket-service";
import { GamePanelService } from "../service/game-panel.service";
import { CanvasPaintService } from "../service/canvas-paint.service";

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
        WebsocketService,
        GamePanelService,
        CanvasPaintService
    ]
})
export class CoreModule {

}