import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Message, OnlineUser } from '../../../../../models/chat.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../material.module';
import { LocalStorageManager } from '../../../../../services/localstorage-manager.service';
import { Account } from '../../../../../models/account.model';
import { DBkeys } from '../../../../../services/db-keys';
import { SignalRService } from '../../../../../services/signalR.service';
import { RequestPricingService } from '../../../../../services/request-pricing.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RequestPricing } from '../../../../../models/request-pricing.model';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../../../../pipes/timeago.pipe';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-reply-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    TimeAgoPipe,
    TablerIconsModule,
    RouterModule,
  ],
  templateUrl: './reply-chat-window.component.html',
  styleUrl: './reply-chat-window.component.scss',
})
export class ReplyChatWindowComponent implements OnInit, AfterViewInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  account: Account | null = null;
  onlineUsers: OnlineUser[] = [];
  messages: Message[] = [];
  messageContent: string = '';
  notifyTyping: boolean = false;
  notifyTypingMessage: string = '';
  @Input() requestPricing: RequestPricing | null = null;
  @Input() userId: string = '';
  pageNumber: number = 1;
  isLoading: boolean = false;

  constructor(
    private signalRService: SignalRService,
    private requestPricingService: RequestPricingService,
    private route: ActivatedRoute,
    private localStorage: LocalStorageManager,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.account = this.localStorage.getDataObject(DBkeys.CURRENT_USER);

    setTimeout(() => {
      if (this.userId) {
        this.loadMessages();
      }
    }, 600);

    this.signalRService['hubConnection'].on(
      'ReceiveMessageList',
      (messages: Message[]) => {
        this.messages = messages;
        this.scrollToBottom(true);
      }
    );

    this.signalRService['hubConnection'].on(
      'ReceiveNewMessage',
      (message: any) => {
        this.messages.push(message);
        this.cdr.detectChanges();
        this.scrollToBottom(true);
      }
    );
  }

  ngAfterViewInit(): void {
    this.scrollToBottom(true);
  }

  scrollToBottom(newMessage: boolean = false): void {
    setTimeout(() => {
      if (this.messageContainer) {
        const container = this.messageContainer.nativeElement;
        if (newMessage) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }, 0);
  }

  loadMessages(): void {
    this.signalRService.loadMessages(this.userId, this.pageNumber);
  }

  sendMessage(): void {
    if (this.messageContent) {
      const newMessage: Message = {
        id: '',
        senderId: this.account?.id!,
        senderName: this.account?.fullName || '',
        receiverId: this.userId,
        receiverName:
          this.onlineUsers.find((x) => x.id === this.userId)?.fullName ?? '',
        content: this.messageContent,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.messages.push(newMessage);
      this.cdr.detectChanges();
      this.scrollToBottom(true);

      this.signalRService.sendMessage(
        this.account?.id!,
        this.userId,
        this.messageContent,
        this.requestPricing?.id,
        true
      );

      this.messageContent = '';
    }
  }
}
