import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() {
  }

  listen(socket, event: string) {
    return new Observable((subscriber => {
      socket.on(event, (data) => {
        subscriber.next(this.decryptSocketMessage(Object.values(data)[0]))
        // console.log(event)
      })
    }))
  }

  emit(socket, event: string, data?: any) {
    socket.emit(event, data)
  }

  decryptSocketMessage(message) {
    const bytes = CryptoJS.AES.decrypt(message, '463b575d4c45f4a342c0dd12b866eedc493d2f6034ecb42d0d12d5c9ffc36cf8');
    const msg = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return msg;
  }
}
