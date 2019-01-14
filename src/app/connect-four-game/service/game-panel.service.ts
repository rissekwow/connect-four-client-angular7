import { Injectable, ElementRef } from "@angular/core";
import { WebsocketService } from "./websocket-service";
import { BehaviorSubject, Subject } from "rxjs";
import { C4BoardCanvasMap } from "../model/canvas/c4-board-canvas-map";
import { WebsocketGameEventJson } from "../model/websocket/websocket-game-event-json";
import { RegisterJson } from "../model/websocket/register-json";
import { CanvasConst } from "../core/const/canvas-const";
import { C4CellCanvas } from "../model/canvas/c4-cell-canvas";


const WEBSOCKET_URL = "http://192.168.173.208:8080/c4g/websocket/";

@Injectable()
export class GamePanelService {
    c4BoardCanvasMap: C4BoardCanvasMap;
    nextMoveColor: string;
    currentGameEvent: BehaviorSubject<WebsocketGameEventJson>;
    isCanvasClicked: Subject<boolean>;
    c4CellWhiteImage: ElementRef;

    public responseStatusCommand: BehaviorSubject<MessageEvent>;

    constructor(private websocketService: WebsocketService) {
      this.currentGameEvent = this.websocketService.currentGameState;
      this.isCanvasClicked = new Subject<boolean>();
    }

    sendRegisterMessageToServer(username: string) {
      this.websocketService.disconnectWebsocket();
      let registerCommand = new RegisterJson();
      registerCommand.nickname = username;
      this.clearBoardToWhiteCellsOnly();
      this.websocketService.initializeWebSocketConnection(WEBSOCKET_URL, username);
      console.log("Init done");
      setTimeout(e => {
        this.websocketService.sendRegisterUserToGameQueueMessage(registerCommand);
      }, 300);
    }

    sendMoveMessageToServer(colNumber: number) {
      setTimeout(e => {
        this.websocketService.sendMoveMessage(colNumber);
        this.isCanvasClicked.next(true);
      }, 300);

    }

    clearBoardToWhiteCellsOnly() {
      this.generateC4BoardCanvasMapWithAllWhiteCells(this.c4CellWhiteImage);
    }

    generateC4BoardCanvasMapWithAllWhiteCells(c4CellWhiteImage) {
        this.c4CellWhiteImage = c4CellWhiteImage;
        this.c4BoardCanvasMap = new C4BoardCanvasMap();
        this.c4BoardCanvasMap.boardCells = [];
        var cellWidth = c4CellWhiteImage.nativeElement.width;
        var cellHeight = c4CellWhiteImage.nativeElement.height;
        for (var x = 0; x < CanvasConst.BOARD_X_SIZE; x++) {
          this.c4BoardCanvasMap.boardCells[x] = [];
          for (var y = 0; y < CanvasConst.BOARD_Y_SIZE; y++) {
            var cell = new C4CellCanvas();
            cell.x = x;
            cell.y = y;
            cell.canvasWidth = CanvasConst.INITIAL_CELL_X_POSITION + ((cellWidth * x) + (CanvasConst.X_SPACE_BETWEEN_CELL * x));
            cell.canvasHeight = CanvasConst.INITIAL_CELL_Y_POSITION + ((cellHeight * y) + (CanvasConst.Y_SPACE_BETWEEN_CELL * y));
            cell.color = CanvasConst.CELL_COLOR_WHITE;
            cell.image = c4CellWhiteImage;
            cell.fake = false;
            this.c4BoardCanvasMap.boardCells[x][y] = cell;
          }
        }
      }

      disconnectWebsocket() {
        this.websocketService.disconnectWebsocket();
      }


}