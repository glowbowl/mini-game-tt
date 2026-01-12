import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ControlPanel } from '../control-panel/control-panel';
import { Game } from '../game/game';
import { Cell, CellState } from '../model/game.model';
import { Subscription, timer } from 'rxjs';
import { ResultModal } from '../result-modal/result-modal';

@Component({
  selector: 'app-layout',
  imports: [ControlPanel, Game, ResultModal],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  readonly SIZE = 10;
  readonly WIN_SCORE = 10;

  cells = signal<Cell[]>([]);
  playerScore = signal(0);
  computerScore = signal(0);
  reactionTimeMs = signal(1000);
  gameRunning = signal(false);

  modalVisible = signal(false);
  modalWinner = signal<string | null>(null);

  private activeCellId = signal<number | null>(null);
  private roundSub: Subscription | null = null;

  constructor() {
    this.initField();
  }

  matrix = computed<Cell[][]>(() => {
    const rows: Cell[][] = [];
    const all = this.cells();

    for (let r = 0; r < this.SIZE; r++) {
      rows.push(all.slice(r * this.SIZE, (r + 1) * this.SIZE));
    }
    console.log(rows);

    return rows;
  });

  startGame(): void {
    this.resetGame();
    this.gameRunning.set(true);
    this.startNextRound();
  }

  onRepeat(): void {
    this.modalVisible.set(false);
    this.startGame();
  }

  onCellClick(cell: Cell): void {
    if (!this.gameRunning()) return;
    if (cell.state !== 'active') return;

    this.clearRoundTimer();

    this.updateCell(cell.id, 'player');
    this.playerScore.update((v) => v + 1);

    this.activeCellId.set(null);
    this.checkGameState();
  }

  private startNextRound(): void {
    if (!this.gameRunning()) return;

    const cell = this.getRandomIdleCell();
    if (!cell) {
      this.finishGame();
      return;
    }

    this.updateCell(cell.id, 'active');
    this.activeCellId.set(cell.id);

    this.roundSub = timer(this.reactionTimeMs()).subscribe(() => {
      this.onPlayerMiss();
    });
  }

  private onPlayerMiss(): void {
    const id = this.activeCellId();
    if (id === null) return;

    this.updateCell(id, 'computer');
    this.computerScore.update((v) => v + 1);
    this.activeCellId.set(null);
    this.checkGameState();
  }

  private checkGameState(): void {
    if (this.playerScore() >= this.WIN_SCORE || this.computerScore() >= this.WIN_SCORE) {
      this.finishGame();
    } else {
      this.startNextRound();
    }
  }

  private finishGame(): void {
    this.clearRoundTimer();
    this.gameRunning.set(false);

    const winner = this.playerScore() >= this.WIN_SCORE ? 'Player' : 'Computer';
    this.modalWinner.set(winner);
    this.modalVisible.set(true);
  }

  private initField(): void {
    this.cells.set(
      Array.from({ length: this.SIZE * this.SIZE }, (_, id) => ({
        id,
        state: 'idle',
      }))
    );
  }

  private resetGame(): void {
    this.clearRoundTimer();
    this.initField();
    this.playerScore.set(0);
    this.computerScore.set(0);
    this.activeCellId.set(null);
  }

  private updateCell(id: number, state: CellState): void {
    this.cells.update((cells) => cells.map((c) => (c.id === id ? { ...c, state } : c)));
  }

  private getRandomIdleCell(): Cell | null {
    const idle = this.cells().filter((c) => c.state === 'idle');
    return idle.length ? idle[Math.floor(Math.random() * idle.length)] : null;
  }

  private clearRoundTimer(): void {
    this.roundSub?.unsubscribe();
    this.roundSub = null;
  }
}
