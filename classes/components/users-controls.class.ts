import { Caretaker, Memento } from '../memento.class.js';
import { Observer } from '../observer.class.js';
import { IUser } from '../../interfaces/user.js';

export class UsersControlsComponent {
  private containerId: string;
  private conteinerElement!: HTMLElement;
  private $usersList: Observer<Array<IUser>>;

  constructor(
    containerId: string,
    dataObserver: Observer<Array<IUser>>,
    private usersCaretacker: Caretaker<Array<IUser>>
  ) {
    this.containerId = containerId;
    this.$usersList = dataObserver;
    this.init();
  }

  private init() {
    this.conteinerElement = document.getElementById(
      this.containerId
    ) as HTMLElement;

    if (!this.conteinerElement) {
      console.warn('Wrong init element ID', this.containerId);
      return;
    }

    this.$usersList.subscribe((data) => {
      this.display();
    }, true);
  }

  private display() {
    const usersTemplate = `
      <div style="margin: 10px">
          <button id="undo-btn" style="margin-right: 10px" ${
            this.usersCaretacker.isFirst ? 'disabled' : ''
          }>Undo</button> 
          <button id="redo-btn" style="margin-right: 10px" ${
            this.usersCaretacker.isLast ? 'disabled' : ''
          }>Redo</button> 
      </div>`;

    this.conteinerElement.innerHTML = usersTemplate;

    document.getElementById('undo-btn')?.addEventListener('click', () => {
      this.usersCaretacker.goBack().state;
    });

    document.getElementById('redo-btn')?.addEventListener('click', () => {
      this.usersCaretacker.goForward().state;
    });
  }
}
