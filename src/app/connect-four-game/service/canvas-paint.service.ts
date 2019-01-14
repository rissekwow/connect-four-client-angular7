import { ElementRef, Injectable, OnInit } from "@angular/core";
import { GamePanelService } from "./game-panel.service";
import { CanvasConst } from "../core/const/canvas-const";
import { WebsocketGameEventJson } from "../model/websocket/websocket-game-event-json";

@Injectable()
export class CanvasPaintService {

    canvasRef: ElementRef;
    c4CellRedImage: ElementRef;
    c4CellYellowImage: ElementRef;
    c4CellWhiteImage: ElementRef;
    ctx: CanvasRenderingContext2D;
    isBoardInitialized: boolean = false;
    columnMouseSelected: number = 0;
    mouseXCoordinate: number = 0;
    mouseYCoordinate: number = 0;
    gameState: WebsocketGameEventJson;

    constructor(private gamePanelService: GamePanelService) {
        let that = this;
        this.gamePanelService.currentGameEvent.asObservable().subscribe((gameEvent) => {
            that.gameState = gameEvent;
            if (that.gameState.moveColNumber !== undefined) {
                that.updateBoardCellToSpecificColorWhereColorIsWhite(that.gamePanelService.c4BoardCanvasMap.boardCells, that.gameState.moveColNumber,
                    that.gameState.areYouRed ? CanvasConst.CELL_COLOR_YELLOW : CanvasConst.CELL_COLOR_RED,
                    that.gameState.areYouRed ? that.c4CellYellowImage : that.c4CellRedImage);
            }
        });

    }

    paint() {
        setTimeout(e => {
            this.update();
            this.fakeCellByMousePositionInCol();
            this.redrawBoardCells();
            this.removeFakeCellByMousePositionInCol();
        },
            CanvasConst.MS_FOR_LOAD_IMAGES);
    }

    updateBoardCellToSpecificColorWhereColorIsWhite(boardCells, xValue, color, image) {
        for (var cell = boardCells[xValue].length - 1; cell > -1; cell--) {
            if (boardCells[xValue][cell].color === CanvasConst.CELL_COLOR_WHITE) {
                this.gamePanelService.c4BoardCanvasMap.boardCells[xValue][cell].color = color;
                this.gamePanelService.c4BoardCanvasMap.boardCells[xValue][cell].image = image;
                return;
            }
        }
    }

    private fakeCellByMousePositionInCol() {
        if (this.columnMouseSelected === 0) return;
        for (var cell = this.gamePanelService.c4BoardCanvasMap.boardCells[this.columnMouseSelected-1].length - 1; cell > -1; cell--) {
            console.log(this.columnMouseSelected);
            if (this.gamePanelService.c4BoardCanvasMap.boardCells[this.columnMouseSelected - 1][cell].color === CanvasConst.CELL_COLOR_WHITE) {
                this.gamePanelService.c4BoardCanvasMap.boardCells[this.columnMouseSelected - 1][cell].fake = true;
                this.gamePanelService.c4BoardCanvasMap.boardCells[this.columnMouseSelected - 1][cell].color = this.gameState.areYouRed ? CanvasConst.CELL_COLOR_RED : CanvasConst.CELL_COLOR_YELLOW;
                this.gamePanelService.c4BoardCanvasMap.boardCells[this.columnMouseSelected - 1][cell].image = this.gameState.areYouRed ? this.c4CellRedImage : this.c4CellYellowImage;
                return;
        }
    }
    }

    private removeFakeCellByMousePositionInCol() {
        for (var x = 0; x < CanvasConst.BOARD_X_SIZE; x++) {
            for (var y = 0; y < CanvasConst.BOARD_Y_SIZE; y++) {
                if(this.gamePanelService.c4BoardCanvasMap.boardCells[x][y].fake === true) {
                    this.gamePanelService.c4BoardCanvasMap.boardCells[x][y].fake = false;
                    this.gamePanelService.c4BoardCanvasMap.boardCells[x][y].color = CanvasConst.CELL_COLOR_WHITE;
                    this.gamePanelService.c4BoardCanvasMap.boardCells[x][y].image = this.c4CellWhiteImage;
                }
            }
        }
    }

    private drawImage(image, canvasWidth, canvasHeight, imgWidth, imgHeight) {
        this.ctx.drawImage(image, canvasWidth, canvasHeight, imgWidth, imgHeight);
    }

    private update() {
        if (this.gameState === undefined || !this.gameState.isYourMove) return;
        this.columnMouseSelected = ~~(this.mouseXCoordinate / CanvasConst.X_SPACE_BETWEEN_COL_SELECTION) + 1;
        if (this.mouseXCoordinate < CanvasConst.NOT_SELECTABLE_DISTANCE || this.mouseXCoordinate > CanvasConst.CANVAS_WIDTH - CanvasConst.NOT_SELECTABLE_DISTANCE
            || this.mouseYCoordinate < CanvasConst.NOT_SELECTABLE_DISTANCE || this.mouseYCoordinate > CanvasConst.CANVAS_HEIGHT - CanvasConst.NOT_SELECTABLE_DISTANCE) this.columnMouseSelected = 0;
    }

    private redrawBoardCells() {
        this.ctx.clearRect(0, 0, CanvasConst.CANVAS_WIDTH, CanvasConst.CANVAS_HEIGHT);
        for (var x = 0; x < CanvasConst.BOARD_X_SIZE; x++) {
            for (var y = 0; y < CanvasConst.BOARD_Y_SIZE; y++) {
                let cell = this.gamePanelService.c4BoardCanvasMap.boardCells[x][y];
                this.ctx.drawImage(cell.image.nativeElement, cell.canvasWidth, cell.canvasHeight, cell.image.nativeElement.width, cell.image.nativeElement.height);
            }
        }
    }
}