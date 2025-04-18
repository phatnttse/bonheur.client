import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SupplierInfoComponent } from './supplier-info/supplier-info.component';
import { Account } from '../../models/account.model';
import { SignalRService } from '../../services/signalR.service';
import { Message, OnlineUser } from '../../models/chat.model';
import { SupplierService } from '../../services/supplier.service';
import { BaseResponse } from '../../models/base.model';
import { Supplier } from '../../models/supplier.model';
import { StatusCode } from '../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatSidebarComponent,
    ChatWindowComponent,
    SupplierInfoComponent,
    MaterialModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  status: number = 0;
  account: Account | null = null;
  @Output() onlineUsers: OnlineUser[] = []; // Online users list
  @Output() messages: Message[] = []; // Received messages
  @Output() selectedUser: OnlineUser | null = null; // Selected user to send message to
  @Output() selectedUserName: string = ''; // Selected user name
  @Output() messageContent: string = ''; // Message content
  @Output() notifyTyping: boolean = false; // Notify when typing
  @Output() notifyTypingMessage: string = ''; // Notify typing message
  @Output() selectedUserId: string = ''; // Selected user to send message to
  @Output() supplier: Supplier | null = null;
  statusPage: number = 0;
  screenWidth: number = window.innerWidth; // Lấy kích thước màn hình ban đầu

  constructor(
    private signalRService: SignalRService,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.updateScreenSize();

    // Listen for online users event
    this.signalRService['hubConnection'].on('OnlineUsers', (users: any) => {
      this.onlineUsers = users.result;
      this.selectUser(this.onlineUsers[0].id); // Select the first user by default
      this.selectedUser = this.onlineUsers[0]; // Set the selected user
      this.getSupplierInfo();
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
        this.messages = [...messages.reverse(), ...this.messages];
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

  ngOnDestroy(): void {
    this.signalRService['hubConnection'].off('OnlineUsers');
    this.signalRService['hubConnection'].off('ReceiveNewMessage');
    this.signalRService['hubConnection'].off('ReceiveMessageList');
    this.signalRService['hubConnection'].off('ReceiveTypingNotification');

    this.messages = [];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateScreenSize();
  }

  updateScreenSize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 1024) {
      this.statusPage = 0;
    }
  }

  // Load messages for a selected user
  loadMessages(recipientId: string): void {
    this.signalRService['hubConnection']
      .invoke('LoadMessages', recipientId, 1)
      .catch((err) => console.error('Error loading messages: ', err));
  }

  // Set the selected user to send the message
  selectUser(userId: string): void {
    this.selectedUserId = userId;
    this.selectedUserName =
      this.onlineUsers.find((x) => x.id === userId)?.fullName || '';
    this.signalRService.loadMessages(userId, 1);
  }

  onTyping(): void {
    if (this.selectedUserId) {
      this.signalRService.notifyTyping(this.selectedUserId);
    }
  }

  onUserSelected(user: OnlineUser): void {
    this.selectedUser = user;
    this.getSupplierInfo();
    this.messages = [];
    this.selectedUserId = user.id;
    this.loadMessages(user.id);
    if (this.screenWidth <= 1024) {
      this.statusPage = 1;
    }
  }

  getSupplierInfo() {
    this.supplierService
      .getSupplierByUserId(this.selectedUser?.id || '')
      .subscribe({
        next: (response: BaseResponse<Supplier>) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            this.supplier = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
  }
}
