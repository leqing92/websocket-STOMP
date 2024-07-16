import { Injectable, OnDestroy } from '@angular/core';
import { Message } from './chat/Message';
import { Client, StompSubscription, Message as StompMessage } from '@stomp/stompjs';

export type ListenerCallBack = (message: Message) => void;

@Injectable({
  providedIn: 'root'
})
// npm i @stomp/rx-stomp
export class WebsocketService implements OnDestroy {
  private client: Client;
  private subscription: StompSubscription | undefined;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(str);
      },
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onStompError = (frame) => {
      console.error(`Broker reported error: ${frame.headers['message']}`);
      console.error(`Additional details: ${frame.body}`);
    };

    this.client.activate();
  }

  public send(task: Message): void {
    if (this.client && this.client.connected) {
      this.client.publish({ destination: '/app/chat', body: JSON.stringify(task) });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  public listen(fun: ListenerCallBack): void {
    if (this.client.connected) {
      this.subscription = this.client.subscribe('/topic/household', (message: StompMessage) => {
        fun(JSON.parse(message.body));
      });
    } else {
      this.client.onConnect = () => {
        this.subscription = this.client.subscribe('/topic/household', (message: StompMessage) => {
          fun(JSON.parse(message.body));
        });
      };
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.client) {
      this.client.deactivate();
    }
  }
}
