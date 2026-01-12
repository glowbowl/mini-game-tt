export type CellState = 'idle' | 'active' | 'player' | 'computer';

export interface Cell {
  id: number;
  state: CellState;
}
