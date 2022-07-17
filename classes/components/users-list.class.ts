import { IUser } from '../../interfaces/user.js';
import { Names, Colors } from '../../data/data.js';
import { Observer } from '../observer.class.js';
import { Caretaker, Memento } from '../memento.class.js';

export class UsersListComponent {
  private userList: Array<IUser> = [];
  private $usersList: Observer<Array<IUser>>;
  private containerId: string;
  private conteinerElement!: HTMLElement;
  private usersCaretaker: Caretaker<Array<IUser>>;

  constructor(
    containerId: string,
    dataObserver: Observer<Array<IUser>>,
    usersCaretacker: Caretaker<Array<IUser>>
  ) {
    this.containerId = containerId;
    this.$usersList = dataObserver;
    this.usersCaretaker = usersCaretacker;

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
      this.userList = [...data];
      this.display();
    }, true);
  }

  private display() {
    const headerTemplate = `
          <h2>Users - common</h2>
          <div>
            <button id="add-user">Add user</button>
          </div>
          <div class="user-row user-header-row">
            <div class="user-id"> ID </div>
            <div class="user-name"> Name </div>
            <div class="user-age"> Age </div>
            <div class="user-actions"> Actions </div>
          </div>
    `;
    const usersTemplate =
      headerTemplate +
      '<div style="min-height: 200px">' +
      this.userList
        .map((user) => {
          return `

          <div class="user-row" user-id="${user.id}">
            <div class="user-id"> ${user.id}</div>
            <div class="user-name" style="color:${user.color}">${user.name} </div>
            <div class="user-age"> ${user.age}</div>
            <div class="user-actions" user-id="${user.id}">
              <button class="change-user-name-btn">Change name</button>
              <button class="change-user-color-btn">Change color</button>
              <button class="delete-user-btn">Delete user</button>
            </div>

          </div>
          `;
        })
        .join('') +
      '</div>' +
      `
      <div style="border: 1px solid grey; margin: 10px 0;"><h5 style="margin: 5px"> Changes history: <h5>
      ` +
      '<ul>' +
      this.usersCaretaker
        .getHistory()
        .map((item) => {
          return `
            
              <li style="color: brown; font-family: monospace; font-size: 14px;">
                ${Number(item.index) + 1}:   
                at ${item.date.toLocaleString()} "${item.info}"
                ${item.isCurrent ? ' <span style="color:blue"><<<</span>' : ''}
              </li>
            
          `;
        })
        .join('') +
      '</ul></div>';

    this.conteinerElement.innerHTML = usersTemplate;

    document.querySelectorAll('.change-user-name-btn').forEach((btn) => {
      btn.addEventListener('click', (el: any) => {
        const id = el.target.parentElement.getAttribute('user-id');
        this.cangeUserName(Number(id));
      });
    });

    document.querySelectorAll('.change-user-color-btn').forEach((btn) => {
      btn.addEventListener('click', (el: any) => {
        const id = el.target.parentElement.getAttribute('user-id');
        this.changeUserColor(Number(id));
      });
    });

    document.querySelectorAll('.delete-user-btn').forEach((btn) => {
      btn.addEventListener('click', (el: any) => {
        const id = el.target.parentElement.getAttribute('user-id');
        this.deleteUser(Number(id));
      });
    });

    document.querySelectorAll('#add-user').forEach((el) =>
      el.addEventListener('click', () => {
        this.addUser();
      })
    );
  }

  private addUser(): void {
    const newUser: IUser = {
      id: Date.now(),
      color: Colors[Math.round(Math.random() * (Colors.length - 1))],
      name: Names[Math.round(Math.random() * (Names.length - 1))],
      age: Math.round(Math.random() * 40 + 25),
    };

    const newValue = [...this.userList, newUser];
    this.usersCaretaker.save(
      new Memento(newValue, `New user added (${newUser.name} - ${newUser.age})`)
    );
  }

  private cangeUserName(id: number): void {
    const index = this.userList.findIndex((u) => u.id === id);
    if (index !== -1) {
      const nameId = Math.round(Math.random() * (Names.length - 1));
      const oldUser = this.userList[index];
      const newUser = { ...this.userList[index], name: Names[nameId] };

      const info = `For user id ${oldUser.id} prop 'name' has been changed (${oldUser.name} -> ${newUser.name})`;

      this.userList.splice(index, 1, newUser);
      this.usersCaretaker.save(new Memento([...this.userList], info));
    }
  }

  private changeUserColor(id: number): void {
    const index = this.userList.findIndex((u) => u.id === id);
    if (index !== -1) {
      const colorId = Math.round(Math.random() * (Colors.length - 1));
      const oldUser = this.userList[index];
      const newUser = { ...oldUser, color: Colors[colorId] };
      const info = `For user id ${oldUser.id} prop 'color' has been changed (${oldUser.color} -> ${newUser.color})`;

      this.userList.splice(index, 1, newUser);
      this.usersCaretaker.save(new Memento([...this.userList], info));
    }
  }

  private deleteUser(id: number): void {
    const newValue = this.userList.filter((u) => u.id !== id);
    this.usersCaretaker.save(
      new Memento([...newValue], `User id ${id} has been deleted`)
    );
  }
}
