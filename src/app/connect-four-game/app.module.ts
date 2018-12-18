import { NgModule } from '@angular/core';
import { AppComponent } from './component/app/app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AboutMeComponent } from './component/about-me/about-me.component';
import { GamePanelModule } from './component/game-panel/game-panel.module';

@NgModule({
  declarations: [
    AppComponent,
    AboutMeComponent
  ],
  imports: [
    CoreModule,
    GamePanelModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
