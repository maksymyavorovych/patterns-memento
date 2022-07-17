import { UsersListComponent } from './classes/components/users-list.class.js';
import { UsersPreviewComponent } from './classes/components/users-preview.class.js';
import { UsersControlsComponent } from './classes/components/users-controls.class.js';
import { Observer } from './classes/observer.class.js';
import { IUser } from './interfaces/user';
import { UsersMock } from './data/data.js';
import { Caretaker, Memento } from './classes/memento.class.js';

const $usersList = new Observer<Array<IUser>>([...UsersMock]);

const usersCaretaker = new Caretaker(
  new Memento([...UsersMock], 'Initial'),
  $usersList
);

const usersControlsComponent = new UsersControlsComponent(
  'controls',
  $usersList,
  usersCaretaker
);
const usersComponent = new UsersListComponent(
  'main',
  $usersList,
  usersCaretaker
);
const usersPreviewComponent = new UsersPreviewComponent(
  'preview',
  $usersList,
  usersCaretaker
);
