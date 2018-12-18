import { Injectable } from "@angular/core";
import { WebsocketService } from "./websocket-service";
import { Subject } from "rxjs";
import { C4BoardCanvasMap } from "../model/canvas/c4-board-canvas-map";
import { WebsocketGameEventJson } from "../model/websocket/websocket-game-event-json";
import { RegisterJson } from "../model/websocket/register-json";
import { CanvasConst } from "../core/const/canvas-const";
import { C4CellCanvas } from "../model/canvas/c4-cell-canvas";



const GAME_STATUS: string[] = ["WAIT_FOR_OPPONENT","OPEN", "RED_MOVE", "YELLOW_MOVE", "DRAW", "RED_WIN", "YELLOW_WIN"];
const WEBSOCKET_URL = "http://localhost:8080/c4g/websocket/";

@Injectable()
export class GamePanelService {
    c4BoardCanvasMap: C4BoardCanvasMap;
    nextMoveColor: string;
    currentGameEvent: Subject<WebsocketGameEventJson>;

    public responseStatusCommand: Subject<MessageEvent>;
    
    constructor(private websocketService: WebsocketService) {
      this.currentGameEvent = this.websocketService.currentGameState;
    }

    sendRegisterMessageToServer(username: string) {
      let registerCommand = new RegisterJson();
      registerCommand.nickname = username;
      this.websocketService.initializeWebSocketConnection(WEBSOCKET_URL, username);
      setTimeout(e => {
        this.websocketService.sendRegisterUserToGameQueueMessage(registerCommand);
      }, 300);
    }

    sendMoveMessageToServer(colNumber: number) {
      setTimeout(e => {
        this.websocketService.sendMoveMessage(colNumber);
      }, 300);
     
    }

    generateC4BoardCanvasMapWithAllWhiteCells(c4CellWhiteImage) {
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
            this.c4BoardCanvasMap.boardCells[x][y] = cell;
          }
        }
      }

      disconnectWebsocket() {
        this.websocketService.disconnectWebsocket();
      }
    

}