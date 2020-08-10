import { observable, action } from "mobx";


export default class AlertStore {
    @observable alerts = [];

    @action
    receiveNotification(payload) {
        this.alerts.push(payload)
    }

}