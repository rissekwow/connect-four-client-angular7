import { Stomp } from '@stomp/stompjs/esm5';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketGameEventJson } from '../model/websocket/websocket-game-event-json';
import { GameStateConst } from '../core/const/game-state-const';
import { RegisterJson } from '../model/websocket/register-json';
import { ServerResponseStatusJson } from '../model/websocket/server-response-status-json';
import { CanvasConst } from '../core/const/canvas-const';
import { PlayerMoveJson } from '../model/websocket/player-move-json';
import * as SockJS from 'sockjs-client';


const WEBSOCKET_SERVER_LISTENER_REGISTER = "/jsa/register";
const WEBSOCKET_SERVER_LISTENER_DISCONNECT = "/jsa/disconnect";
const WEBSOCKET_SERVER_LISTENER_MOVE = "/jsa/move";
const WEBSOCKET_CLIENT_SUBSCRIBE_USER = "/game/user/";
const WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN = "/game/token/";
const RESPONSE_CODE_TOKEN_REGISTERED = "TOKEN_REGISTERED";
const RESPONSE_CODE_GAME_STARTED_RED = "GAME_STARTED_RED";
const RESPONSE_CODE_GAME_STARTED_YELLOW = "GAME_STARTED_YELLOW";
const RESPONSE_CODE_OPPONENT_MOVE = "OPPONENT_MOVE";
const RESPONSE_CODE_YELLOW_WIN = "YELLOW_WIN";
const RESPONSE_CODE_RED_WIN = "RED_WIN";
const RESPONSE_CODE_DRAW = "DRAW";

@Injectable()
export class WebsocketService {

  private stompClient;
  private isStompConnected: boolean;
  private registeredUserToken: string;
  private username: string;
  private userGameColor: string;
  private opponentName: string;
  currentGameState: BehaviorSubject<WebsocketGameEventJson>;


  constructor() {
    this.isStompConnected = false;
    let websocketGameEvent = new WebsocketGameEventJson();
        websocketGameEvent.currentGameState = GameStateConst.INIT;
    this.currentGameState = new BehaviorSubject<WebsocketGameEventJson>(websocketGameEvent);
  }

  disconnectWebsocket(): void {
    if (this.isStompConnected) {
      let registerCommand = new RegisterJson();
      registerCommand.nickname = this.username;
      this.stompClient.send(WEBSOCKET_SERVER_LISTENER_DISCONNECT, {}, JSON.stringify(registerCommand));
      this.stompClient.disconnect();
      this.isStompConnected = false;
      this.username = undefined;
      this.registeredUserToken = undefined;

    }
  }

  initializeWebSocketConnection(serverUrl: string, username: string) {
    this.username = username;
    let ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.isStompConnected = true;
      that.stompClient.subscribe(WEBSOCKET_CLIENT_SUBSCRIBE_USER + username, (message) => {
        let responseStatusCommand: ServerResponseStatusJson = JSON.parse(message.body);
        if (responseStatusCommand.responseCode === RESPONSE_CODE_TOKEN_REGISTERED) {
          that.registeredUserToken = responseStatusCommand.message;
          console.log(username + ", token: " + that.registeredUserToken);
          let websocketGameEvent = new WebsocketGameEventJson();
          websocketGameEvent.currentGameState = GameStateConst.WAIT_FOR_OPPONENT;
          that.currentGameState.next(websocketGameEvent);
          that.stompClient.subscribe(WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN + that.registeredUserToken, (message) => {
            let responseStatusTokenCommand: ServerResponseStatusJson = JSON.parse(message.body);
            console.log(message);
            switch (responseStatusTokenCommand.responseCode) {
              case RESPONSE_CODE_GAME_STARTED_RED: {
                that.userGameColor = CanvasConst.CELL_COLOR_RED;
                let opponentName = responseStatusTokenCommand.message;
                let websocketEvent = that.handleGameStartedWebsocketMessage(that.userGameColor, opponentName);
                that.currentGameState.next(websocketEvent);
                break;
              }
              case RESPONSE_CODE_GAME_STARTED_YELLOW: {
                that.userGameColor = CanvasConst.CELL_COLOR_YELLOW;
                let opponentName = responseStatusTokenCommand.message;
                let websocketEvent = that.handleGameStartedWebsocketMessage(that.userGameColor, opponentName);
                that.currentGameState.next(websocketEvent);
                break;
              }
              case RESPONSE_CODE_OPPONENT_MOVE: {
                let websocketEvent = that.handleOpponentMoveWebsocketMessage(responseStatusTokenCommand.message, that.userGameColor);
                that.currentGameState.next(websocketEvent);
                break;
              }
              case RESPONSE_CODE_RED_WIN: {
                let websocketEvent = that.handleRedWinWebsocketMessage(responseStatusTokenCommand.message, that.userGameColor);
                that.currentGameState.next(websocketEvent);
                break;
              }
              case RESPONSE_CODE_YELLOW_WIN: {
                let websocketEvent = that.handleYellowWinWebsocketMessage(responseStatusTokenCommand.message, that.userGameColor);
                that.currentGameState.next(websocketEvent);
                break;
              }
              case RESPONSE_CODE_DRAW: {
                let websocketEvent = that.handleDrawWebsocketMessage(responseStatusTokenCommand.message, that.userGameColor);
                that.currentGameState.next(websocketEvent);
                break;
              }
            }
          });
        }
      });


    });
  }

  sendRegisterUserToGameQueueMessage(registerCommand: RegisterJson) {
    this.stompClient.send(WEBSOCKET_SERVER_LISTENER_REGISTER, {}, JSON.stringify(registerCommand));
  }

  sendMoveMessage(colNumber: number) {
    let playerMoveCommand = new PlayerMoveJson();
    playerMoveCommand.token = this.registeredUserToken;
    playerMoveCommand.colNumber = colNumber;
    this.stompClient.send(WEBSOCKET_SERVER_LISTENER_MOVE, {}, JSON.stringify(playerMoveCommand));
  }

  private handleGameStartedWebsocketMessage(userGameColor: string, opponentName: string) {
    let websocketGameEvent = new WebsocketGameEventJson();
    websocketGameEvent.currentGameState = GameStateConst.OPEN;
    websocketGameEvent.areYouRed = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.isYourMove = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.moveColNumber = undefined;
    websocketGameEvent.opponentName = opponentName;
    return websocketGameEvent;
  }

  private handleOpponentMoveWebsocketMessage(message: string, userGameColor: string) {
    let websocketGameEvent = new WebsocketGameEventJson();
    websocketGameEvent.currentGameState = userGameColor === CanvasConst.CELL_COLOR_RED ? GameStateConst.YELLOW_MOVE : GameStateConst.RED_MOVE;
    websocketGameEvent.areYouRed = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.isYourMove = true;
    websocketGameEvent.moveColNumber = +message;
    return websocketGameEvent;
  }

  private handleRedWinWebsocketMessage(message: string, userGameColor: string) {
    let websocketGameEvent = new WebsocketGameEventJson();
    websocketGameEvent.currentGameState = GameStateConst.RED_WIN;
    websocketGameEvent.areYouRed = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.moveColNumber = userGameColor === CanvasConst.CELL_COLOR_RED ? undefined : +message;
    websocketGameEvent.isYourMove = false;
    return websocketGameEvent;
  }

  private handleYellowWinWebsocketMessage(message: string, userGameColor: string) {
    let websocketGameEvent = new WebsocketGameEventJson();
    websocketGameEvent.currentGameState = GameStateConst.YELLOW_WIN;
    websocketGameEvent.areYouRed = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.moveColNumber = userGameColor === CanvasConst.CELL_COLOR_RED ? +message : undefined;
    websocketGameEvent.isYourMove = false;
    return websocketGameEvent;
  }

  private handleDrawWebsocketMessage(message: string, userGameColor: string) {
    let websocketGameEvent = new WebsocketGameEventJson();
    websocketGameEvent.currentGameState = GameStateConst.DRAW;
    websocketGameEvent.areYouRed = userGameColor === CanvasConst.CELL_COLOR_RED;
    websocketGameEvent.moveColNumber = websocketGameEvent.isYourMove === true ? undefined : +message;
    websocketGameEvent.isYourMove = false;
    return websocketGameEvent;
  }




}