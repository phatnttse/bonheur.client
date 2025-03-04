import { TimeAgoPipe } from './../../../pipes/timeago.pipe';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  AzureBlobResponse,
  Message,
  MessageAttachment,
  OnlineUser,
} from '../../../models/chat.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageManager } from '../../../services/localstorage-manager.service';
import { Account } from '../../../models/account.model';
import { DBkeys } from '../../../services/db-keys';
import { SignalRService } from '../../../services/signalR.service';
import { MessageService } from '../../../services/message.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../../models/base.model';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    TimeAgoPipe,
    PickerComponent,
  ],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.scss',
})
export class ChatWindowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() messages: Message[] = []; // Received messages
  @Input() selectedUser: OnlineUser | null = null; // Selected user to send message to
  @Input() notifyTyping: boolean = false; // Notify when typing
  @Input() notifyTypingMessage: string = ''; // Notify typing message
  @Input() statusPage: number = 0; //0 desktop, 1 mobile
  account: Account | null = null; // Thông tin tài khoản người dùng
  messageContent: string = ''; // Nội dung tin nhắn nhập vào
  typingTimeout: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  pageNumber: number = 1;
  isLoading: boolean = false;
  isFirstLoad: boolean = true; // Đánh dấu lần đầu tải trang
  previewFiles: { name: string; url: string }[] = [];
  uploadedFiles: File[] = [];
  uploadedMessageAttachments: MessageAttachment[] = [];
  azureBlobResponses: AzureBlobResponse[] = [];
  showEmojiPicker: boolean = false;

  constructor(
    private localStorage: LocalStorageManager,
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private statusService: StatusService
  ) {}

  ngOnInit(): void {
    this.account = this.localStorage.getDataObject(DBkeys.CURRENT_USER); // Lấy thông tin tài khoản người dùng
  }

  ngOnDestroy(): void {
    this.messages = [];
    this.pageNumber = 1;
    this.isFirstLoad = true;
  }

  // Send message when the form is submitted
  sendMessage(): void {
    if (this.uploadedFiles.length > 0) {
      this.uploadAttachments();
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
      this.scrollToBottom();

      this.signalRService.sendMessage(
        this.account?.id!,
        this.selectedUser.id,
        this.messageContent
      );

      this.messageContent = ''; // Xóa nội dung sau khi gửi
    }
  }

  onTyping(): void {
    if (this.selectedUser) {
      this.signalRService.notifyTyping(this.selectedUser.id);

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
    if (!this.selectedUser || this.isLoading) return;

    this.isLoading = true;

    const container = this.messagesContainer.nativeElement;

    const prevScrollHeight = container.scrollHeight; // Lưu lại tổng chiều cao trước khi load
    const prevScrollTop = container.scrollTop; // Lưu vị trí cuộn hiện tại

    this.pageNumber++;

    await this.signalRService.loadMessages(
      this.selectedUser.id,
      this.pageNumber
    );

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewFiles.push({
            name: file.name,
            url: e.target?.result as string,
          });
        };
        reader.readAsDataURL(file);
        this.uploadedFiles.push(file);
      }
    }
  }

  uploadAttachments(): void {
    if (this.uploadedFiles.length > 0) {
      if (this.uploadedFiles.length > 3) {
        this.notificationService.warning(
          'Warning',
          'You can only upload up to 3 files at a time'
        );
        return;
      }

      this.uploadedFiles.forEach((file) => {
        if (file.size > 2000000) {
          this.notificationService.warning(
            'Warning',
            'File size must be less than 2MB'
          );
          return;
        }
      });
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.messageService.uploadAttachment(this.uploadedFiles).subscribe({
      next: (response: BaseResponse<AzureBlobResponse[]>) => {
        this.azureBlobResponses = response.data;
        this.uploadedFiles = [];

        const newMessage: Message = {
          id: '',
          senderId: this.account?.id!,
          senderName: this.account?.fullName || '',
          receiverId: this.selectedUser!.id,
          receiverName: this.selectedUser!.fullName,
          content: this.messageContent,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachments: this.azureBlobResponses.map((x) => {
            return {
              id: 0,
              fileName: x.blob.name,
              filePath: x.blob.uri,
              fileType: x.blob.contentType,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }),
        };

        this.messages.push(newMessage);
        this.cdr.detectChanges();

        this.signalRService.sendMessage(
          this.account?.id!,
          this.selectedUser!.id,
          this.messageContent,
          undefined,
          undefined,
          this.azureBlobResponses
        );

        this.messageContent = '';
        this.previewFiles = [];
        this.uploadedMessageAttachments = []; // Xóa file đính kèm sau khi gửi
        this.azureBlobResponses = []; // Xóa file đính kèm sau khi gửi
        this.scrollToBottom();

        this.azureBlobResponses = [];
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }
  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp|avif)$/i.test(fileName);
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.previewFiles.length) {
      this.previewFiles.splice(index, 1);
      this.uploadedFiles.splice(index, 1); // Xoá luôn trong uploadedFiles
    }
  }

  handleClick($event: EmojiEvent) {
    console.log($event.emoji);
    this.messageContent += $event.emoji.native;
  }
  emojiFilter(e: string): boolean {
    // Can use this to test [emojisToShowFilter]
    if (e && e.indexOf && e.indexOf('1F4') >= 0) {
      return true;
    }
    return false;
  }
}
