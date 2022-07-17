export class UsersControlsComponent {
    constructor(containerId, dataObserver, usersCaretacker) {
        this.usersCaretacker = usersCaretacker;
        this.containerId = containerId;
        this.$usersList = dataObserver;
        this.init();
    }
    init() {
        this.conteinerElement = document.getElementById(this.containerId);
        if (!this.conteinerElement) {
            console.warn('Wrong init element ID', this.containerId);
            return;
        }
        this.$usersList.subscribe((data) => {
            this.display();
        }, true);
    }
    display() {
        var _a, _b;
        const usersTemplate = `
      <div style="margin: 10px">
          <button id="undo-btn" style="margin-right: 10px" ${this.usersCaretacker.isFirst ? 'disabled' : ''}>Undo</button> 
          <button id="redo-btn" style="margin-right: 10px" ${this.usersCaretacker.isLast ? 'disabled' : ''}>Redo</button> 
      </div>`;
        this.conteinerElement.innerHTML = usersTemplate;
        (_a = document.getElementById('undo-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            console.log('Undo action', this.usersCaretacker.getCurrentState());
            this.usersCaretacker.goBack().state;
        });
        (_b = document.getElementById('redo-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
            console.log('Redo action');
            this.usersCaretacker.goForward().state;
        });
    }
}
