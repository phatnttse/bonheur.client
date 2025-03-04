export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  isRead: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  attachments?: MessageAttachment[];
  createdAt?: string;
  updatedAt?: string;
}
export interface MessageAttachment {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnlineUser {
  id: string;
  connectionId: string;
  userName: string;
  email: string;
  fullName: string;
  pictureUrl: string;
  isOnline: boolean;
  unreadMessages: number;
  latestMessage: string;
  latestMessageAt: string;
}
export interface SendMessageRequest {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface MessageStatistics {
  totalMessages: number;
  unreadMessages: number;
}

export interface AzureBlobResponse {
  status: string;
  error: boolean;
  blob: AzureBlob;
}

export interface AzureBlob {
  uri: string;
  name: string;
  contentType: string;
  content: string;
}
