import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-panel',
  imports: [FormsModule],
  templateUrl: './control-panel.html',
  styleUrl: './control-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanel {
  reactionTimeMs = model<number>();
  gameRunning = input<boolean>(false);
  playerScore = input<number>();
  computerScore = input<number>();

  start = output<void>();

  onValueChange(newValue: number) {
    this.reactionTimeMs.set(newValue ?? 0);
  }
}
