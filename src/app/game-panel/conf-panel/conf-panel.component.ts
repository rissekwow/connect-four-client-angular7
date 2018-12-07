import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GamePanelService } from '../service/game-panel.service';

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
