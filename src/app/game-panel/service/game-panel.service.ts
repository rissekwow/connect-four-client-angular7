import { C4BoardCanvasMap } from "../../shared/canvas-model/c4-board-canvas-map";
import { Injectable } from "@angular/core";
import { C4CellCanvas } from "../../shared/canvas-model/c4-cell-canvas";
import { CanvasConst } from "../../shared/canvas-model/canvas-const";
import { WebsocketService } from "./websocket-service";
import { Subject } from "rxjs";
import { RegisterCommand } from "src/app/shared/websocket/register-command";

const GAME_STATUS: string[] = ["WAIT_FOR_OPPONENT","OPEN", "DRAW", "RED_WIN", "YELLOW_WIN"];
const WEBSOCKET_URL = "http://localhost:8080/c4g/websocket/";
@Injectable()
export class GamePanelService {
    c4BoardCanvasMap: C4BoardCanvasMap;
    nextMoveColor: string = CanvasConst.CELL_COLOR_RED;
    public responseStatusCommand: Subject<MessageEvent>;
    


    constructor(private websocketService: WebsocketService) {
    }

    sendRegisterMessageToServer(username: string) {
      let registerCommand = new RegisterCommand();
      registerCommand.nickname = username;
      this.websocketService.initializeWebSocketConnection(WEBSOCKET_URL, username);
      setTimeout(e => {
        this.websocketService.sendMessage(registerCommand);
      }, 100);
     
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
    

}