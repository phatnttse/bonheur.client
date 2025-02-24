import { TimeAgoPipe } from './../../../pipes/timeago.pipe';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Message, OnlineUser } from '../../../models/chat.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageManager } from '../../../services/localstorage-manager.service';
import { Account } from '../../../models/account.model';
import { DBkeys } from '../../../services/db-keys';
import { SignalRService } from '../../../services/signalR.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, TimeAgoPipe],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
})
export class ChatWindowComponent implements OnInit {
  @Input() messages: Message[] = []; // Received messages
  @Input() selectedUser: OnlineUser | null = null; // Selected user to send message to
  account: Account | null = null; // Thông tin tài khoản người dùng

  messageContent: string = ''; // Nội dung tin nhắn nhập vào

  constructor(
    private localStorage: LocalStorageManager,
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.account = this.localStorage.getDataObject(DBkeys.CURRENT_USER); // Lấy thông tin tài khoản người dùng
  }

  // Send message when the form is submitted
  sendMessage(): void {
    if (this.messageContent.trim() == '') {
      return;
    }
    if (this.selectedUser && this.messageContent) {
      const newMessage: Message = {
        id: '', // Assign a unique id if available
        senderId: this.account?.id!,
        senderName: this.account?.fullName || '', // Assign sender name if available
        receiverId: this.selectedUser.id,
        receiverName: this.selectedUser.fullName,
        content: this.messageContent,
        isRead: false, // Set initial read status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Thêm tin nhắn vào danh sách trước khi gửi
      this.messages.push(newMessage);
      this.cdr.detectChanges();

      this.signalRService.sendMessage(
        this.account?.id!,
        this.selectedUser.id,
        this.messageContent
      );

      this.messageContent = ''; // Xóa nội dung sau khi gửi
    }
  }
}
