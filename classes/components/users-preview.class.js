import { Memento } from '../memento.class.js';
export class UsersPreviewComponent {
    constructor(containerId, dataObserver, usersCaretacker) {
        this.userList = [];
        // this.userList = userList;
        this.containerId = containerId;
        this.$usersList = dataObserver;
        this.usersCaretaker = usersCaretacker;
        this.init();
    }
    init() {
        this.conteinerElement = document.getElementById(this.containerId);
        if (!this.conteinerElement) {
            console.warn('Wrong init element ID', this.containerId);
            return;
        }
        this.$usersList.subscribe((data) => {
            this.userList = [...data];
            this.display();
        }, true);
    }
    display() {
        const headerTemplate = `
          <h3>Users preview</h3>
    `;
        const usersTemplate = headerTemplate +
            '<div>' +
            this.userList
                .map((user, index) => {
                return `
          <span style="font-weight: bold; display: inline-block; width: 300px;"> ${index + 1}. ${user.name} - ${user.age} years. </span> 
          <button class="delete-user-btn" user-id="${user.id}">Delete user</button> 
          </br>
          `;
            })
                .join('') +
            '</div>';
        this.conteinerElement.innerHTML = usersTemplate;
        document.querySelectorAll('.delete-user-btn').forEach((btn) => {
            btn.addEventListener('click', (el) => {
                const id = el.target.getAttribute('user-id');
                this.deleteUser(Number(id));
            });
        });
    }
    deleteUser(id) {
        const newValue = this.userList.filter((u) => u.id !== id);
        this.usersCaretaker.save(new Memento(newValue, `User id ${id} has been deleted`));
    }
}
