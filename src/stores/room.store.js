import { observable, action, computed } from "mobx";

export default class RoomStore {
    @observable rooms = [];

    @action joinRoom(room) {
        this.rooms.push(room)
    }

    @action leaveRoom(room) {
        this.rooms = this.rooms.filter(item => item !== room)
    }

    @action
    isMemberOfActiveRoom(activeRoom) {
        return this.rooms.includes(activeRoom)
        // return this.rooms.find(item => item === activeRoom)
    }

}
