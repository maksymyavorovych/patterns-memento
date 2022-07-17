import { Observer } from './observer.class.js';

export interface IMemento<T> {
  state: T;
  // ---------- not mandatory props and methos
  date?: Date;
  info?: string;
}

export class Memento<T> implements IMemento<T> {
  private _state: T;
  private _date: Date;
  private _info: string;

  constructor(state: T, info?: string) {
    this._state = state;
    this._info = info || '';
    this._date = new Date();
  }

  public get state(): T {
    return this._state;
  }

  public set state(state: T) {
    this._state = state;
  }

  // ---------- not mandatory props and methos

  public get date(): Date {
    return this._date;
  }

  public get info(): string {
    return this._info;
  }
}

export interface IHistoryItem<T> {
  date: Date;
  info: string;
  state?: T;
  isCurrent?: boolean;
  index?: number;
}

export interface ICaretaker<T> {
  save: (memento: Memento<T>, info?: string) => void;
  goBack: () => Memento<T>;
  goForward: () => Memento<T>;
  // ---------- not mandatory props and methos
  isLast?: boolean;
  isFirst?: boolean;
  getHistory?: () => Array<{ date: Date; info: string; state?: T }>;
  // private mementos: Array<Memento<T>>; // History of mementos
  // private index: number;  // Current position in a history
}

export class Caretaker<T> implements ICaretaker<T> {
  private mementos: Array<Memento<T>> = [];
  private index = -1;

  constructor(initial: Memento<T>, private dataObserver: Observer<T>) {
    this.save(initial);
  }

  public save(memento: Memento<T>): void {
    if (!this.isLast) {
      this.mementos.length = this.index + 1;
    }
    this.mementos.push(memento);
    this.index++;
    this.dataObserver.value = memento.state;
    console.log('After memento is added', this.index, this.mementos);
  }

  public goBack(): Memento<T> {
    if (!this.isFirst) {
      this.index--;
    }
    this.dataObserver.value = this.mementos[this.index].state;
    return this.mementos[this.index];
  }

  public goForward(): Memento<T> {
    if (!this.isLast) {
      this.index++;
    }
    this.dataObserver.value = this.mementos[this.index].state;
    return this.mementos[this.index];
  }

  // ---------- not mandatory props and methos

  public get isLast(): boolean {
    return this.index === this.mementos.length - 1;
  }

  public get isFirst(): boolean {
    return this.index === 0;
  }

  public getCurrentState(): Memento<T> {
    return this.mementos[this.index];
  }

  public getHistory(withState?: boolean): Array<IHistoryItem<T>> {
    const history: Array<IHistoryItem<T>> = [];
    return this.mementos.map((memento, index) => {
      return {
        index,
        isCurrent: this.index === index,
        info: memento.info,
        date: memento.date,
        state: withState ? memento.state : undefined,
      };
    });
  }
}
