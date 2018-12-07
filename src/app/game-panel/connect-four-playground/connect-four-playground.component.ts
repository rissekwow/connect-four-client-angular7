import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GamePanelService } from '../service/game-panel.service';
import { CanvasPaintService } from '../service/canvas-paint.service';
import { CanvasConst } from 'src/app/shared/canvas-model/canvas-const';

@Component({
  selector: 'app-connect-four-playground',
  templateUrl: './connect-four-playground.component.html',
  styleUrls: ['./connect-four-playground.component.css']
})
export class ConnectFourPlaygroundComponent implements OnInit {

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
    this.canvasPaintService.c4CellYellowImage = this.c4CellWhiteImage;
    this.canvasPaintService.c4CellWhiteImage = this.c4CellWhiteImage;
    this.gamePanelService.generateC4BoardCanvasMapWithAllWhiteCells(this.c4CellWhiteImage);
    this.createPaintCanvasInterval(CanvasConst.CANVAS_PAINT_REFRESH_TIMER);
    this.canvasRef.nativeElement.addEventListener(CanvasConst.MOUSE_ACTION_MOVE, this.onMouseMoveCanvasEvent.bind(this), false);
    this.canvasRef.nativeElement.addEventListener(CanvasConst.MOUSE_ACTION_CLICK, this.onMouseClickCanvasEvent.bind(this), false);
  }

  private updateBoardCellToSpecificColorWhereColorIsWhite(boardCells, xValue, color, image) {
    for (var cell = boardCells[xValue].length-1; cell>-1; cell--) {
      if (boardCells[xValue][cell].color === CanvasConst.CELL_COLOR_WHITE) {
        this.gamePanelService.c4BoardCanvasMap.boardCells[xValue][cell].color = color;
        this.gamePanelService.c4BoardCanvasMap.boardCells[xValue][cell].image = image;
        return;
      }
    }
  }

  private onMouseClickCanvasEvent(event: MouseEvent) {
    const boardCells = this.gamePanelService.c4BoardCanvasMap.boardCells;
    const moveColor = this.gamePanelService.nextMoveColor === CanvasConst.CELL_COLOR_YELLOW ? CanvasConst.CELL_COLOR_YELLOW : CanvasConst.CELL_COLOR_RED;
    const imageColor = this.gamePanelService.nextMoveColor === CanvasConst.CELL_COLOR_YELLOW ? this.c4CellYellowImage : this.c4CellRedImage;
    if (this.canvasPaintService.columnMouseSelected === 0) return;
    this.updateBoardCellToSpecificColorWhereColorIsWhite(boardCells, this.canvasPaintService.columnMouseSelected-1, 
      moveColor, imageColor);
    if (this.gamePanelService.nextMoveColor === CanvasConst.CELL_COLOR_YELLOW) this.gamePanelService.nextMoveColor = CanvasConst.CELL_COLOR_RED 
    else this.gamePanelService.nextMoveColor = CanvasConst.CELL_COLOR_YELLOW;
  }

  private onMouseMoveCanvasEvent(event: MouseEvent) {
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
