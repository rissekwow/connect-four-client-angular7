import { ElementRef, Injectable, OnInit } from "@angular/core";
import { GamePanelService } from "./game-panel.service";
import { CanvasConst } from "../core/const/canvas-const";
import { WebsocketGameEventJson } from "../model/websocket/websocket-game-event-json";

@Injectable()
export class CanvasPaintService {

    canvasRef: ElementRef;
    c4BoardImage: ElementRef;
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
            this.redrawBoardCells();
            this.drawColToClickSelectionRect();
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

    private drawImage(image, canvasWidth, canvasHeight, imgWidth, imgHeight) {
        this.ctx.drawImage(image, canvasWidth, canvasHeight, imgWidth, imgHeight);
    }

    private update() {
        if (this.gameState === undefined || !this.gameState.isYourMove) return;
        this.columnMouseSelected = ~~(this.mouseXCoordinate / CanvasConst.X_SPACE_BETWEEN_COL_SELECTION) + 1; 
        if (this.mouseXCoordinate < CanvasConst.NOT_SELECTABLE_DISTANCE || this.mouseXCoordinate > this.c4BoardImage.nativeElement.width - CanvasConst.NOT_SELECTABLE_DISTANCE
            || this.mouseYCoordinate < CanvasConst.NOT_SELECTABLE_DISTANCE || this.mouseYCoordinate > this.c4BoardImage.nativeElement.height - CanvasConst.NOT_SELECTABLE_DISTANCE) this.columnMouseSelected = 0;
    }

    private drawColToClickSelectionRect() {
        if (this.columnMouseSelected !== 0) {
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(
                (this.columnMouseSelected - 1) * CanvasConst.X_SPACE_BETWEEN_COL_SELECTION,
                0,
                CanvasConst.X_SPACE_BETWEEN_COL_SELECTION,
                this.canvasRef.nativeElement.width);
            this.ctx.globalAlpha = 1.0;
        }
    }

    private redrawBoardCells() {
        this.drawImage(this.c4BoardImage.nativeElement, 0, 0, this.c4BoardImage.nativeElement.width, this.c4BoardImage.nativeElement.height);
        for (var x = 0; x < CanvasConst.BOARD_X_SIZE; x++) {
            for (var y = 0; y < CanvasConst.BOARD_Y_SIZE; y++) {
                let cell = this.gamePanelService.c4BoardCanvasMap.boardCells[x][y];
                this.ctx.drawImage(cell.image.nativeElement, cell.canvasWidth, cell.canvasHeight, cell.image.nativeElement.width, cell.image.nativeElement.height);
            }
        }
    }
}