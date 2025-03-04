import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Message, OnlineUser } from '../../../models/chat.model';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../../pipes/timeago.pipe';
import { TruncatePipe } from '../../../pipes/truncate.pipte';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [MaterialModule, CommonModule, TimeAgoPipe, TruncatePipe],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss',
})
export class ChatSidebarComponent implements OnInit {
  @Input() onlineUsers: OnlineUser[] = []; // Online users list
  @Output() userSelected = new EventEmitter<OnlineUser>(); // Phát sự kiện khi chọn user
  @Input() messages: Message[] = []; // Received messages
  @Input() selectedUser: OnlineUser | null = null; // Selected user to send message to
  @Input() screenWidth: number = window.innerWidth;
  statusPage: number = 0; // 0 desktop, 1 mobile

  ngOnInit(): void {
    if (this.screenWidth <= 1024) {
      this.statusPage = 1;
    }
  }

  selectUser(user: OnlineUser): void {
    this.userSelected.emit(user); // Gửi user lên ChatComponent
  }

  getUnreadMessageCount(user: OnlineUser): number {
    return this.messages.filter((m) => m.senderId === user.id && !m.isRead)
      .length;
  }
}
