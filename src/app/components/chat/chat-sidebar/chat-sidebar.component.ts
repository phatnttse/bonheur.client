import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { OnlineUser } from '../../../models/chat.model';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.scss',
})
export class ChatSidebarComponent {
  @Input() onlineUsers: OnlineUser[] = []; // Online users list
}
