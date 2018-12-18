import { Component, OnInit } from '@angular/core';
import { GamePanelService } from 'src/app/connect-four-game/service/game-panel.service';

@Component({
  selector: 'app-conf-panel',
  templateUrl: './conf-panel.component.html',
  styleUrls: ['./conf-panel.component.css']
})
export class ConfPanelComponent implements OnInit {

  username: string;

  constructor(private gamePanelService: GamePanelService) { }

  ngOnInit() {
  }

  findOpponentUsingWebsocket() {
    this.gamePanelService.sendRegisterMessageToServer(this.username);
  }

}
