import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GamePanelComponent } from './game-panel/game-panel.component';
import { AboutMeComponent } from './about-me/about-me.component';

const routes: Routes = [
    {
        path: "", redirectTo: "/game-panel", pathMatch:"full"
    },
    {
        path: "game-panel", component: GamePanelComponent
    },
    {
        path: "about-me", component: AboutMeComponent
    }
]

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}