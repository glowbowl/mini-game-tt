import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Cell } from '../model/game.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [NgClass],
  templateUrl: './game.html',
  styleUrl: './game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Game {
  matrix = input<Cell[][]>();
  cellClick = output<Cell>();
}
