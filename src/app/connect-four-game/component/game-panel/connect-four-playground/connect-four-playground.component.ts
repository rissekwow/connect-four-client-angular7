import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamePanelService } from 'src/app/connect-four-game/service/game-panel.service';
import { CanvasPaintService } from 'src/app/connect-four-game/service/canvas-paint.service';
import { CanvasConst } from 'src/app/connect-four-game/core/const/canvas-const';


@Component({
  selector: 'app-connect-four-playground',
  templateUrl: './connect-four-playground.component.html',
  styleUrls: ['./connect-four-playground.component.css']
})
export class ConnectFourPlaygroundComponent implements OnInit{
  
  @ViewChild("c4PlaygroundCanvas") canvasRef: ElementRef;
  @ViewChild("c4BoardImage") c4BoardImage: ElementRef;
  @ViewChild("c4CellRedImage") c4CellRedImage: ElementRef;
  @ViewChild("c4CellYellowImage") c4CellYellowImage: ElementRef;
  @ViewChild("c4CellWhiteImage") c4CellWhiteImage: ElementRef;
  ctx: CanvasRenderingContext2D;
  
  constructor(private gamePanelService: GamePanelService, private canvasPaintService: CanvasPaintService) { }
  
  ngOnInit() {
    this.canvasPaintService.ctx = this.canvasRef.nativeElement.getContext("2d");
    this.canvasPaintService.canvasRef = this.canvasRef;
    this.canvasPaintService.c4BoardImage = this.c4BoardImage;
    this.canvasPaintService.c4CellRedImage = this.c4CellRedImage;
    this.canvasPaintService.c4CellYellowImage = this.c4CellYellowImage;
    this.canvasPaintService.c4CellWhiteImage = this.c4CellWhiteImage;
    this.gamePanelService.generateC4BoardCanvasMapWithAllWhiteCells(this.c4CellWhiteImage);
    this.createPaintCanvasInterval(CanvasConst.CANVAS_PAINT_REFRESH_TIMER);
    this.canvasRef.nativeElement.addEventListener(CanvasConst.MOUSE_ACTION_MOVE, this.onMouseMoveCanvasEvent.bind(this), false);
    this.canvasRef.nativeElement.addEventListener(CanvasConst.MOUSE_ACTION_CLICK, this.onMouseClickCanvasEvent.bind(this), false);
  }

  onMouseClickCanvasEvent() {
    const boardCells = this.gamePanelService.c4BoardCanvasMap.boardCells;
    const moveColor = this.canvasPaintService.gameState.areYouRed ? CanvasConst.CELL_COLOR_RED : CanvasConst.CELL_COLOR_YELLOW;
    const imageColor = this.canvasPaintService.gameState.areYouRed  ? this.c4CellRedImage : this.c4CellYellowImage;
    if (this.canvasPaintService.columnMouseSelected === 0) return;
    this.canvasPaintService.updateBoardCellToSpecificColorWhereColorIsWhite(boardCells, this.canvasPaintService.columnMouseSelected - 1,
        moveColor, imageColor);
    this.gamePanelService.sendMoveMessageToServer(this.canvasPaintService.columnMouseSelected-1);
    this.canvasPaintService.gameState.isYourMove = false;
    this.canvasPaintService.columnMouseSelected = 0;
  }

  onMouseMoveCanvasEvent(event: MouseEvent) {
      this.canvasPaintService.mouseXCoordinate = event.layerX;
      this.canvasPaintService.mouseYCoordinate = event.layerY;
  };

  private createPaintCanvasInterval(waitTime : number) {
    setInterval(e => {
      this.canvasPaintService.paint();
     },   
     waitTime);
  }

}
