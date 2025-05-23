import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { DBkeys } from './db-keys';
import { LocalStorageManager } from './localstorage-manager.service';
import { AzureBlobResponse, Message } from '../models/chat.model';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: HubConnection;
  private localStorageManager = inject(LocalStorageManager);

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/chat`, {
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
  };

  public sendMessage = (
    senderId: string,
    receiverId: string,
    content: string,
    requestPricingId?: number,
    isSupplierReply?: boolean,
    azureBlobUploadedResponses?: AzureBlobResponse[]
  ) => {
    this.hubConnection
      .invoke('SendMessage', {
        senderId,
        receiverId,
        content,
        requestPricingId,
        isSupplierReply,
        azureBlobUploadedResponses,
      })
      .catch((err) => console.error('Error sending message: ', err));
  };

  public async loadMessages(
    recipientId: string,
    pageNumber: number
  ): Promise<Message[]> {
    try {
      return await this.hubConnection.invoke(
        'LoadMessages',
        recipientId,
        pageNumber
      );
    } catch (err) {
      console.error('Error loading messages: ', err);
      return []; // Trả về mảng rỗng để tránh lỗi undefined
    }
  }

  // Check notify typing event
  notifyTyping(recipientId: string): void {
    this.hubConnection.invoke('NotifyTyping', recipientId).catch((err) => {
      console.error('Error notifying typing: ', err);
    });
  }
}
