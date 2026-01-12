import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-result-modal',
  imports: [],
  templateUrl: './result-modal.html',
  styleUrl: './result-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultModal {
  winner = input<string | null>();
  repeat = output<void>();
  close = output<void>();

}
