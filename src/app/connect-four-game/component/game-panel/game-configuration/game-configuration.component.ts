import { Component, OnInit } from '@angular/core';
import { GamePanelService } from 'src/app/connect-four-game/service/game-panel.service';

@Component({
  selector: 'app-game-configuration',
  templateUrl: './game-configuration.component.html',
  styleUrls: ['./game-configuration.component.css']
})
export class GameConfigurationComponent implements OnInit {

  username: string;

  constructor(private gamePanelService: GamePanelService) { }

  ngOnInit() {
  }

  findOpponentUsingWebsocket() {
    this.gamePanelService.sendRegisterMessageToServer(this.username);
  }

}
