import { Injectable } from '@angular/core';
import { Stomp } from 'stompjs';
import { SockJS } from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { WebsocketGameEventJson } from '../model/websocket/websocket-game-event-json';
import { GameStateConst } from '../core/const/game-state-const';
import { RegisterJson } from '../model/websocket/register-json';
import { ServerResponseStatusJson } from '../model/websocket/server-response-status-json';
import { CanvasConst } from '../core/const/canvas-const';
import { PlayerMoveJson } from '../model/websocket/player-move-json';

const WEBSOCKET_SERVER_LISTENER_REGISTER = "/jsa/register";
const WEBSOCKET_SERVER_LISTENER_DISCONNECT = "/jsa/disconnect";
const WEBSOCKET_SERVER_LISTENER_MOVE = "/jsa/move";
const WEBSOCKET_CLIENT_SUBSCRIBE_USER = "/game/user/";
const WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN = "/game/token/";
const RESPONSE_CODE_TOKEN_REGISTERED = "TOKEN_REGISTERED";
const RESPONSE_CODE_GAME_STARTED = "GAME_STARTED";
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
  currentGameState: BehaviorSubject<WebsocketGameEventJson>;


  constructor() {
    this.isStompConnected = false;
    let websocketGameEvent = new WebsocketGameEventJson();
        websocketGameEvent.currentGameState = GameStateConst.OPEN;
    this.currentGameState = new BehaviorSubject<WebsocketGameEventJson>(websocketGameEvent);

  }

  disconnectWebsocket(): void {
    if (this.isStompConnected) {
      let registerCommand = new RegisterJson();
      registerCommand.nickname = this.username;
      this.stompClient.send(WEBSOCKET_SERVER_LISTENER_DISCONNECT, {}, JSON.stringify(registerCommand));
      this.stompClient.disconnect();
      this.isStompConnected = false;
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
          let websocketGameEvent = new WebsocketGameEventJson();
          websocketGameEvent.currentGameState = GameStateConst.WAIT_FOR_OPPONENT;
          that.currentGameState.next(websocketGameEvent);
          that.stompClient.subscribe(WEBSOCKET_CLIENT_SUBSCRIBE_TOKEN + that.registeredUserToken, (message) => {
            let responseStatusTokenCommand: ServerResponseStatusJson = JSON.parse(message.body);
            if (responseStatusTokenCommand.responseCode === RESPONSE_CODE_GAME_STARTED) {
              that.userGameColor = responseStatusTokenCommand.message === CanvasConst.CELL_COLOR_RED ? CanvasConst.CELL_COLOR_RED : CanvasConst.CELL_COLOR_YELLOW;
              let websocketGameEvent = new WebsocketGameEventJson();
              websocketGameEvent.currentGameState = that.userGameColor === CanvasConst.CELL_COLOR_RED ? CanvasConst.CELL_COLOR_RED : CanvasConst.CELL_COLOR_YELLOW
              websocketGameEvent.areYouRed = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              websocketGameEvent.isYourMove = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              that.currentGameState.next(websocketGameEvent);
            }
            else if (responseStatusTokenCommand.responseCode === RESPONSE_CODE_OPPONENT_MOVE) {
              let websocketGameEvent = new WebsocketGameEventJson();
              websocketGameEvent.currentGameState = that.userGameColor === CanvasConst.CELL_COLOR_RED ? GameStateConst.YELLOW_MOVE : GameStateConst.RED_MOVE;
              websocketGameEvent.areYouRed = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              websocketGameEvent.isYourMove = true;
              websocketGameEvent.moveColNumber = +responseStatusTokenCommand.message;
              that.currentGameState.next(websocketGameEvent);
            }
            else if (responseStatusTokenCommand.responseCode === RESPONSE_CODE_RED_WIN) {
              let websocketGameEvent = new WebsocketGameEventJson();
              websocketGameEvent.currentGameState = GameStateConst.RED_WIN;
              websocketGameEvent.areYouRed = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              websocketGameEvent.moveColNumber = that.userGameColor === CanvasConst.CELL_COLOR_RED ? undefined : +responseStatusTokenCommand.message;
              websocketGameEvent.isYourMove = false;
              that.currentGameState.next(websocketGameEvent);
            }
            else if (responseStatusTokenCommand.responseCode === RESPONSE_CODE_YELLOW_WIN) {
              let websocketGameEvent = new WebsocketGameEventJson();
              websocketGameEvent.currentGameState = GameStateConst.YELLOW_WIN;
              websocketGameEvent.areYouRed = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              websocketGameEvent.moveColNumber = that.userGameColor === CanvasConst.CELL_COLOR_RED ? +responseStatusTokenCommand.message : undefined;
              websocketGameEvent.isYourMove = false;
              that.currentGameState.next(websocketGameEvent);
            }
            else if (responseStatusTokenCommand.responseCode === RESPONSE_CODE_DRAW) {
              let websocketGameEvent = new WebsocketGameEventJson();
              websocketGameEvent.currentGameState = GameStateConst.DRAW;
              websocketGameEvent.areYouRed = that.userGameColor === CanvasConst.CELL_COLOR_RED;
              websocketGameEvent.moveColNumber = websocketGameEvent.isYourMove === true ? undefined : +responseStatusTokenCommand.message;
              websocketGameEvent.isYourMove = false;
              that.currentGameState.next(websocketGameEvent);
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



}