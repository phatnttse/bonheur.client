import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { Message, OnlineUser } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss',
})
export class ChatSidebarComponent {
  @Input() onlineUsers: OnlineUser[] = []; // Online users list
  @Output() userSelected = new EventEmitter<OnlineUser>(); // Phát sự kiện khi chọn user
  @Input() messages: Message[] = []; // Received messages

  selectUser(user: OnlineUser): void {
    this.userSelected.emit(user); // Gửi user lên ChatComponent
  }

  getUnreadMessageCount(user: OnlineUser): number {
    return this.messages.filter((m) => m.senderId === user.id && !m.isRead)
      .length;
  }
}
