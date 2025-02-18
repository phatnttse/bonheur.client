import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { DBkeys } from './db-keys';
import { LocalStoreManager } from './localstorage-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: HubConnection;
  private localStorageManager = inject(LocalStoreManager);

  public startConnection = (accountId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat?uid=${accountId}`, {
        accessTokenFactory: () => {
          const token = this.localStorageManager
            .getData(DBkeys.ACCESS_TOKEN)
            ?.trim();
          return token ? token : '';
        },
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch((err) => {
        console.log('Error while starting connection: ' + err);
      });

    // Listen to online users event
    this.hubConnection.on('OnlineUsers', (users: any) => {
      console.log('Online users:', users);
    });

    // Listen to new message event
    this.hubConnection.on('ReceiveNewMessage', (message: any) => {
      console.log('New message received:', message);
    });

    // Listen to user connection event
    this.hubConnection.on('UserConnected', (user: any) => {
      console.log('User connected:', user);
    });

    this.hubConnection.on('ReceiveMessageList', (list: any) => {
      console.log('ReceiveMessageList:', list);
    });

    this.hubConnection.on('ReceiveTypingNotification', (sender: any) => {
      console.log('ReceiveTypingNotification:', sender);
    });
  };

  public sendMessage = (
    senderId: string,
    receiverId: string,
    content: string
  ) => {
    this.hubConnection
      .invoke('SendMessage', { senderId, receiverId, content })
      .catch((err) => console.error('Error sending message: ', err));
  };

  public loadMessages = (recipientId: string, page: number) => {
    this.hubConnection
      .invoke('LoadMessages', recipientId, page)
      .catch((err) => console.error('Error loading messages: ', err));
  };

  // Check notify typing event
  notifyTyping(recipientId: string): void {
    this.hubConnection.invoke('NotifyTyping', recipientId).catch((err) => {
      console.error('Error notifying typing: ', err);
    });
  }
}
