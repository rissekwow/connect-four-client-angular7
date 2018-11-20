import { NgModule } from "@angular/core";
import { SidenavMenuComponent } from "./sidenav-menu/sidenav-menu.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

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
    exports: [SidenavMenuComponent]
})
export class CoreModule {

}