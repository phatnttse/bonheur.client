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
  typingTimeout: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  isFirstLoad: boolean = true;

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
        this.messages = [...messages.reverse(), ...this.messages];
        this.cdr.detectChanges();
      }
    );

    this.signalRService['hubConnection'].on(
      'ReceiveNewMessage',
      (message: any) => {
        this.messages.push(message);
        this.cdr.detectChanges();
      }
    );

    this.signalRService['hubConnection'].on(
      'ReceiveTypingNotification',
      (sender: any) => {
        this.notifyTyping = true;
        this.notifyTypingMessage = `${sender} is typing...`;
        setTimeout(() => {
          this.notifyTyping = false;
          this.notifyTypingMessage = '';
        }, 3000);
      }
    );
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
      this.scrollToBottom();

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
  onTyping(): void {
    if (this.userId) {
      this.signalRService.notifyTyping(this.userId);

      // Ngăn spam sự kiện bằng cách đặt timeout
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.notifyTyping = false; // Reset trạng thái đang nhập
      }, 3000); // Sau 3 giây không nhập nữa thì ẩn thông báo
    }
  }

  ngAfterViewInit() {
    if (this.messagesContainer) {
      this.scrollToBottom(); // Lần đầu tiên tải, cuộn xuống cuối

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0 && !this.isLoading) {
            if (this.isFirstLoad) {
              this.scrollToBottom();
              this.isFirstLoad = false;
            }
          }
        });
      });

      observer.observe(this.messagesContainer.nativeElement, {
        childList: true,
        subtree: true,
      });

      const container = this.messagesContainer.nativeElement;
      container.addEventListener('scroll', () => this.onScroll());
    }
  }

  onScroll() {
    const container = this.messagesContainer.nativeElement;

    if (container.scrollTop === 0 && !this.isLoading) {
      this.loadMoreMessages();
    }
  }

  async loadMoreMessages() {
    if (!this.userId || this.isLoading) return;

    this.isLoading = true;

    const container = this.messagesContainer.nativeElement;

    const prevScrollHeight = container.scrollHeight; // Lưu lại tổng chiều cao trước khi load
    const prevScrollTop = container.scrollTop; // Lưu vị trí cuộn hiện tại

    this.pageNumber++;

    await this.signalRService.loadMessages(this.userId, this.pageNumber);

    this.cdr.detectChanges(); // Cập nhật giao diện trước khi tính toán lại scroll

    setTimeout(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop =
        prevScrollTop + (newScrollHeight - prevScrollHeight);
    }, 0);

    // if (newMessages.length > 0) {
    //   this.messages = [...newMessages.reverse(), ...this.messages];

    //   this.cdr.detectChanges(); // Cập nhật giao diện

    //   setTimeout(() => {
    //     const newScrollHeight = container.scrollHeight;
    //     container.scrollTop =
    //       newScrollHeight - prevScrollHeight + prevScrollTop;
    //   }, 0);
    // }

    this.isLoading = false;
  }

  scrollToFirstNewMessage(addedCount: number) {
    setTimeout(() => {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop =
        container.scrollHeight / (this.messages.length / addedCount);
    }, 100);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
