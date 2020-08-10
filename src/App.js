import React, { useState } from 'react';
import { inject, observer, Observer } from 'mobx-react'
import SocketIOClient from "socket.io-client";
import { Alert, Tabs, Button } from 'antd';




import logo from './logo.svg';
import './App.css';

const { TabPane } = Tabs

const socket = {
  chat: SocketIOClient('localhost:3000/chat'),
  alert: SocketIOClient('localhost:3000/alert')
}

@inject('messageStore', 'alertStore', 'roomStore')
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      text: '',
      room: 'general',
      buttonText: `Join the chat`
    }
  }


  componentDidMount() {
    const userName = prompt('Please Enter your username !');
    const { roomStore } = this.props
    this.setState({
      username: userName
    })
    socket.chat.on('messageClient', ({ sender, room, message }) => {
      if (roomStore.isMemberOfActiveRoom(room)) {
        this.props.messageStore.receiveMessage({ sender, room, message })
      }
    })
    socket.alert.on('alertClient', ({ message }) => {
      this.props.alertStore.receiveNotification(message)
    })
  }


  handleSwitchRoom = (room) => {
    const { roomStore } = this.props
    if (roomStore.isMemberOfActiveRoom(room)) {
      this.setState({
        buttonText: `Leave the chat`
      })
    } else {
      this.setState({
        buttonText: `Join the chat`
      })
    }
    this.setState({
      room
    })
  }

  handleJoinOrLeave = () => {
    const { room } = this.state
    const { roomStore } = this.props
    if (!roomStore.isMemberOfActiveRoom(room)) {
      socket.chat.emit("joinRoom", room)
      roomStore.joinRoom(room)
      this.setState({
        buttonText: `Leave the chat`
      })
    } else {
      socket.chat.emit("leaveRoom", room)
      roomStore.leaveRoom(room)
      this.setState({
        buttonText: `Join the chat`
      })
    }
  }

  handleSubmit = () => {
    const { username, text, room } = this.state
    const { roomStore } = this.props
    if (roomStore.isMemberOfActiveRoom(room)) {
      socket.chat.emit("messageServer", {
        sender: username,
        room,
        message: text
      })
    } else {
      alert(`You must join the chatroom first before you can sending any message`)
    }

    this.setState({
      text: ''
    })
  }



  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      text: e.target.value
    })
  }

  render() {
    const { room, buttonText } = this.state
    const { roomStore } = this.props
    console.log(this.props.roomStore.rooms)
    return (
      <main className="App">
        <section className="chat">
          <input placeholder="insert your messages" value={this.state.text} onChange={this.handleChange.bind(this)} />
          <button onClick={this.handleSubmit.bind(this)}>Submit</button>
          <Tabs defaultActiveKey={"general"} onChange={this.handleSwitchRoom.bind(this)}>
            {Object.keys(this.props.messageStore.messages).map(tab => (
              <TabPane tab={tab} key={tab}>
                <ul>
                  {this.props.messageStore.messages[room].map(msg =>
                    (
                      <li>
                        <strong>{msg.sender} : </strong>
                        {msg.message}
                      </li>
                    )
                  )}
                </ul>
                <Button type="primary" onClick={this.handleJoinOrLeave.bind(this)}>{buttonText}</Button>
              </TabPane>
            ))
            }

          </Tabs>
        </section>
        <section className="alert">
          {this.props.alertStore.alerts.map(msg => (
            <Alert message={`New Alert`} description={msg} closable />
          ))}
        </section>
      </main>
    );
  }
}

export default App;
