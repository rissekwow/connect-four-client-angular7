import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { C4BoardCanvasMap } from './c4-board-canvas-map';
import { C4CellCanvas } from './c4-cell-canvas';
import { GamePanelService } from '../game-panel.service';

const INITIAL_CELL_X_POSITION: number = 28;
const INITIAL_CELL_Y_POSITION: number = 28;
const X_SPACE_BETWEEN_CELL: number = 23;
const Y_SPACE_BETWEEN_CELL: number = 18;
const BOARD_X_SIZE: number = 7;
const BOARD_Y_SIZE: number = 6;
const MS_FOR_LOAD_IMAGES: number = 1000;

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

  constructor(private gamePanelService: GamePanelService) { }

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext("2d");
    this.generateC4BoardCanvasMap();
    this.drawBoard();
  }

  generateC4BoardCanvasMap() {
    this.gamePanelService.c4BoardCanvasMap = new C4BoardCanvasMap();
    this.gamePanelService.c4BoardCanvasMap.boardCells = [];
    var cellWidth = this.c4CellWhiteImage.nativeElement.width;
    var cellHeight = this.c4CellWhiteImage.nativeElement.height;
    for (var x = 0; x < BOARD_X_SIZE; x++) {
      this.gamePanelService.c4BoardCanvasMap.boardCells[x] = [];
      for (var y = 0; y < BOARD_Y_SIZE; y++) {
        var cell = new C4CellCanvas();
        cell.x = x;
        cell.y = y;
        cell.canvasWidth = INITIAL_CELL_X_POSITION + ((cellWidth * x) + (X_SPACE_BETWEEN_CELL * x));
        cell.canvasHeight = INITIAL_CELL_Y_POSITION + ((cellHeight * y) + (Y_SPACE_BETWEEN_CELL * y));
        cell.color = "white";
        cell.image = this.c4CellWhiteImage;
        this.gamePanelService.c4BoardCanvasMap.boardCells[x][y] = cell;
      }
    }
  }

  drawBoard() {
    setTimeout(e => {
      this.ctx.drawImage(this.c4BoardImage.nativeElement, 0, 0, this.c4BoardImage.nativeElement.width, this.c4BoardImage.nativeElement.height);
      for (var x = 0; x < BOARD_X_SIZE; x++) {
        for (var y = 0; y < BOARD_Y_SIZE; y++) {
          let cell = this.gamePanelService.c4BoardCanvasMap.boardCells[x][y];
          this.ctx.drawImage(cell.image.nativeElement, cell.canvasWidth, cell.canvasHeight, cell.image.nativeElement.width, cell.image.nativeElement.height);
        }
      }
    },
      MS_FOR_LOAD_IMAGES);
  }

}
