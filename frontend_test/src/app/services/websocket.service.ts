import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment.prod';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocket?: WebSocket;
  private messages: Subject<any>;


  constructor() {
    this.messages = new Subject<any>();
  }

  connect(task_id:string): void {
    let ws_scheme = window.location.protocol == "https:" ? "wss://" : "ws://";

    this.websocket = new WebSocket(
          ws_scheme
          + env.websocket.host
          + env.websocket.path
          + task_id 
          + "/"
        );

    this.websocket.onopen = () =>{
          this.websocket?.send(JSON.stringify({
            type: 'check',
            data: {
                task_id: task_id
            }
          }));
        }

    this.websocket.onmessage = (event) => {
      // this.messages.next(event.data);
      let response = JSON.parse(event.data);
      let type = response.status;

      if (type ==='SUCCESS' || type === 'INVALID' ||  type === 'ERROR') {

        this.messages.next(event.data);

        this.websocket?.send(JSON.stringify({
          type: 'delete',
          data: {
              task_id: task_id
          }
        }));
      }

      if (type === 'DELETED') {
        this.websocket?.close()
      }

    };

    this.websocket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.websocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  // sendMessage(message: any): void {
  //   this.websocket?.send(JSON.stringify(message));
  // }

  getMessages(task_id:string): Observable<any> {
    this.connect(task_id)
    return this.messages.asObservable();
  }

  close(): void {
    this.websocket?.close();
  }

  // task_status?:string;
  // task_result?:string;
  // callSocket?: WebSocket 
  // connectWebsocket(task_id:string):any{
  //   let ws_scheme = window.location.protocol == "https:" ? "wss://" : "ws://";
    

  //   this.callSocket = new WebSocket(
  //     ws_scheme
  //     + env.websocket.host
  //     + env.websocket.path
  //     + task_id 
  //     + "/"
  //   );
  
  //   this.callSocket.onopen = (e) =>{
  //     this.callSocket?.send(JSON.stringify({
  //       type: 'check',
  //       data: {
  //           task_id: task_id
  //       }
  //     }));
  //   }

  //   this.callSocket.onmessage = (e) => {
  //     let response = JSON.parse(e.data);
  //     let type = response.status;
  //     console.log(response)

  //     if (type ==='SUCCESS' || type === 'INVALID' ||  type === 'ERROR') {
  //       this.task_status = type;
  //       this.task_result = response.remark

  //       this.callSocket?.send(JSON.stringify({
  //         type: 'delete',
  //         data: {
  //             task_id: task_id
  //         }
  //       }));
  //     }

  //     if (type === 'DELETED') {
  //       this.callSocket?.close()
  //     }
  //   }
  // }
}
