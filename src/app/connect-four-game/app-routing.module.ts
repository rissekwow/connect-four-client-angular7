import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GamePanelComponent } from './component/game-panel/game-panel.component';
import { ContactComponent } from './component/contact/contact.component';

const routes: Routes = [
    {
        path: "", redirectTo: "/game", pathMatch:"full"
    },
    {
        path: "game", component: GamePanelComponent
    },
    // {
    //     path: "stats", component: StatisticsPanelComponent
    // },
    {
        path: "contact", component: ContactComponent
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