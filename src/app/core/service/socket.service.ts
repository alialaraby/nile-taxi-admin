import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class SocketService {

	constructor(private socket: Socket) { 
        this.socket.on('connect', () => {
            console.log('socketX', socket);
        })
    }

    // emit event
	// fetchMovies() {
	// 	this.socket.emit('emitTest');
	// } 

	// listen event
	listenToServer(event: string) {
        return new Observable(
            (subscriber) => {
                this.socket.on(event, (data) => {
                    subscriber.next(data);
                })
            }
        )
	}
}