import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react'
import './index.css';
import App from './App';
import MessageStore from './stores/message.store'
import * as serviceWorker from './serviceWorker';
import AlertStore from './stores/alert.store';

import 'antd/dist/antd.css';
import RoomStore from './stores/room.store';


const stores = {}

stores.messageStore = new MessageStore()
stores.alertStore = new AlertStore()
stores.roomStore = new RoomStore()

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
