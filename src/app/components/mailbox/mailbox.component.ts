import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../services/signalR.service';
import { Account } from '../../models/account.model';
import { LocalStoreManager } from '../../services/localstorage-manager.service';
import { DBkeys } from '../../services/db-keys';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit {
  account: Account | null = null;
  onlineUsers: any[] = []; // Online users list
  messages: any[] = []; // Received messages
  selectedUserId: string = ''; // Selected user to send message to
  selectedUserName: string = ''; // Selected user name
  messageContent: string = ''; // Message content
  notifyTyping: boolean = false; // Notify when typing
  notifyTypingMessage: string = ''; // Notify typing message

  constructor(
    private signalRService: SignalRService,
    private localStorage: LocalStoreManager
  ) {}

  ngOnInit(): void {
    this.account = this.localStorage.getData(DBkeys.CURRENT_USER);
    if (this.account) {
      this.signalRService.startConnection(this.account?.id!);
    }

    // Listen for online users event
    this.signalRService['hubConnection'].on('OnlineUsers', (users: any) => {
      this.onlineUsers = users.result;
    });

    // Listen for new message event
    this.signalRService['hubConnection'].on(
      'ReceiveNewMessage',
      (message: any) => {
        this.messages.push(message); // Add new message to the list
      }
    );

    // Listen for loaded messages event
    this.signalRService['hubConnection'].on(
      'ReceiveMessageList',
      (messages: any[]) => {
        this.messages = messages; // Set the loaded messages
      }
    );

    // Listen for typing notification event
    this.signalRService['hubConnection'].on(
      'ReceiveTypingNotification',
      (sender: any) => {
        this.notifyTyping = true; // Notify when typing
        this.notifyTypingMessage = `${sender} is typing...`;
        setTimeout(() => {
          this.notifyTyping = false;
          this.notifyTypingMessage = '';
        }, 3000);
      }
    );
  }

  // Load messages for a selected user
  loadMessages(recipientId: string): void {
    this.signalRService['hubConnection']
      .invoke('LoadMessages', recipientId, 1)
      .catch((err) => console.error('Error loading messages: ', err));
  }

  // Send message when the form is submitted
  sendMessage(): void {
    if (this.selectedUserId && this.messageContent) {
      const newMessage = {
        senderId: this.account?.id!,
        content: this.messageContent,
      };

      // Thêm tin nhắn vào danh sách trước khi gửi
      this.messages.push(newMessage);

      this.signalRService.sendMessage(
        this.account?.id!,
        this.selectedUserId,
        this.messageContent
      );

      this.messageContent = ''; // Xóa nội dung sau khi gửi
    }
  }

  // Set the selected user to send the message
  selectUser(userId: string): void {
    this.selectedUserId = userId;
    this.selectedUserName = this.onlineUsers.find((x) => x.id === userId).name;
    this.signalRService.loadMessages(userId, 1); // Load messages for the selected user
  }

  onTyping(): void {
    if (this.selectedUserId) {
      this.signalRService.notifyTyping(this.selectedUserId);
    }
  }
}
