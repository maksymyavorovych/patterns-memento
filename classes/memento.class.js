export class Memento {
    constructor(state, info) {
        this._state = state;
        this._info = info || '';
        this._date = new Date();
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this._state = state;
    }
    // ---------- not mandatory props and methos
    get date() {
        return this._date;
    }
    get info() {
        return this._info;
    }
}
export class Caretaker {
    constructor(initial, dataObserver) {
        this.dataObserver = dataObserver;
        this.mementos = [];
        this.index = -1;
        this.save(initial);
    }
    save(memento) {
        if (!this.isLast) {
            this.mementos.length = this.index + 1;
        }
        this.mementos.push(memento);
        this.index++;
        this.dataObserver.value = memento.state;
        console.log('After memento is added', this.index, this.mementos);
    }
    goBack() {
        if (!this.isFirst) {
            this.index--;
        }
        this.dataObserver.value = this.mementos[this.index].state;
        return this.mementos[this.index];
    }
    goForward() {
        if (!this.isLast) {
            this.index++;
        }
        this.dataObserver.value = this.mementos[this.index].state;
        return this.mementos[this.index];
    }
    // ---------- not mandatory props and methos
    get isLast() {
        return this.index === this.mementos.length - 1;
    }
    get isFirst() {
        return this.index === 0;
    }
    getCurrentState() {
        return this.mementos[this.index];
    }
    getHistory(withState) {
        const history = [];
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
