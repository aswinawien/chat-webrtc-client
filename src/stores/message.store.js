import { observable, action } from "mobx";

export default class MessageStore {
    @observable messages = {
        general: [{ sender: 'Nerdx6969', message: 'Hell yeah man, floor gang auuh!' }],
        typescript: [{ sender: 'Pokilover', message: 'IDK man Javascript kinda gay bruh' }],
        nestjs: [{ sender: 'Pewdsiepie', message: 'Nestjs is big PP' }]
    };

    @action
    sendMessage = ({ sender, room, message }) => {
        this.messages[room].push({ sender, message })
    };


    @action
    receiveMessage = ({ sender, room, message }) => {
        this.messages[room].push({ sender, message })
    }
}