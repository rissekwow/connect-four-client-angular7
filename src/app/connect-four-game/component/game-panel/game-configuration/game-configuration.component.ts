import { Component, OnInit } from '@angular/core';
import { GamePanelService } from 'src/app/connect-four-game/service/game-panel.service';
import { CanvasConst } from 'src/app/connect-four-game/core/const/canvas-const';
import { GameStateConst } from 'src/app/connect-four-game/core/const/game-state-const';

@Component({
  selector: 'app-game-configuration',
  templateUrl: './game-configuration.component.html',
  styleUrls: ['./game-configuration.component.css']
})
export class GameConfigurationComponent {

  username: string;
  areYouRed: boolean;
  isYourMove: boolean;
  setNicknamePanel: boolean;
  gameFindingPanel: boolean;
  openGamePanel: boolean;
  gameEndPanel: boolean;
  gameEndResult: string;
  opponentName: string;



  constructor(private gamePanelService: GamePanelService) {
   this.switchToSetNicknamePanel();
    var that = this;
    this.gamePanelService.currentGameEvent.asObservable().subscribe((gameEvent) => {
      switch (gameEvent.currentGameState) {
        case GameStateConst.OPEN:
          that.areYouRed = gameEvent.areYouRed;
          that.switchToOpenGamePanel();
          that.isYourMove = gameEvent.isYourMove;
          that.opponentName = gameEvent.opponentName;
          break;
        case GameStateConst.YELLOW_MOVE:
          that.isYourMove = that.areYouRed;
          break;
        case GameStateConst.RED_MOVE:
        that.isYourMove = !that.areYouRed;
          break;
        case GameStateConst.YELLOW_WIN:
          that.switchToGameEndPanel();
          that.gameEndResult = GameStateConst.YELLOW_WIN;
          break;
        case GameStateConst.RED_WIN:
          that.switchToGameEndPanel();
          that.gameEndResult = GameStateConst.RED_WIN;
          break;
        case GameStateConst.DRAW:
          that.switchToGameEndPanel();
          that.gameEndResult = GameStateConst.DRAW;
          break;
        case GameStateConst.OPPONENT_LEAVED:
          that.switchToGameEndPanel();
          that.gameEndResult = GameStateConst.OPPONENT_LEAVED;
          break;
      }
    });
    this.gamePanelService.isCanvasClicked.asObservable().subscribe((isClicked) => {
      if (isClicked) {
        that.isYourMove = !that.isYourMove;
      }
    });
  }

  switchToSetNicknamePanel() {
    this.setNicknamePanel = true;
    this.gameFindingPanel = false;
    this.openGamePanel = false;
    this.gameEndPanel = false;
  }

  switchToWaitForOpponentPanel() {
    this.setNicknamePanel = false;
    this.gameFindingPanel = true;
    this.openGamePanel = false;
    this.gameEndPanel = false;
  }

  switchToOpenGamePanel() {
    this.setNicknamePanel = false;
    this.gameFindingPanel = false;
    this.openGamePanel = true;
    this.gameEndPanel = false;
  }

  switchToGameEndPanel() {
    this.setNicknamePanel = false;
    this.gameFindingPanel = false;
    this.openGamePanel = false;
    this.gameEndPanel = true;
  }

  findOpponentUsingWebsocket() {
    this.gamePanelService.sendRegisterMessageToServer(this.username);
    this.switchToWaitForOpponentPanel();
  }

  disconnectUserFromQueueUsingWebsocket() {
    this.gamePanelService.disconnectWebsocket();
    this.switchToSetNicknamePanel();
  }

  areYouWinner() {
    return (this.areYouRed && this.gameEndResult === GameStateConst.RED_WIN)
    || (!this.areYouRed && this.gameEndResult === GameStateConst.YELLOW_WIN)
    || (this.gameEndResult === GameStateConst.OPPONENT_LEAVED);
  }

  areYouLoser() {
    if (this.areGameDraw()) return false;
    return !this.areYouWinner();
  }

  areGameDraw() {
    return this.gameEndResult === GameStateConst.DRAW;
  }

}
