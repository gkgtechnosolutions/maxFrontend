import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComponettitleService } from '../../services/componenttitle.service';
import { ChatBotService } from '../../services/chat-bot.service';
import { AdminMessageRequest } from '../../domain/chatbot';

@Component({
  selector: 'app-recent-chat',
  templateUrl: './recent-chat.component.html',
  styleUrl: './recent-chat.component.scss'
})
export class RecentChatComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  chatID: any;
  user: any;
  userId: any;
  selectedFile: any = null; // Store selected file data (type, preview, name, file object)
  fileAcceptType: string = '';
  

  constructor( private titleService: ComponettitleService ,private chatService: ChatBotService,private messageService: ChatBotService , private cdRef: ChangeDetectorRef ) { }
  messages: any[] = [];
  selectedImage: string | ArrayBuffer | null = null;
  recentChats: any[] = [];
  selectedChat: any = null;
  newMessage: string = '';
  mockMessages: any[] = [];
 @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
 private refreshInterval: any;
 @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.titleService.changeTitle('Recent Chat');
 
    this.getUserId();
    this.getRecentChat();
      this.refreshInterval = setInterval(() => {
        this.refresh();   this.getRecentChat();
      }, 1000); 
  
  }
  
  
  getRecentChat(){
    this.chatService.getRecentChats().subscribe({
      next: (chats) => {
        this.recentChats = chats;

      },
      error: (error) => {
        console.error('Error fetching recent chats:', error);
      }
    });
  }
//   ngAfterViewInit(): void {
    
ngOnDestroy(): void {
  // Clean up the interval to prevent memory leaks when the component is destroyed
  if (this.refreshInterval) {
    clearInterval(this.refreshInterval);
  }
}
  
// }
scrollToBottom() {
  try {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  } catch (err) {
    console.error('Scroll error:', err);
  }
}
isImageMessage(message: string): boolean {
  return message.startsWith('Photo : ') && message.includes('http');
}

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file); // Convert image to base64 for preview
  }
}

triggerImageUpload(): void {
  document.getElementById('imageUpload')?.click();
}
getImageUrl(message: string): string {
  const urlMatch = message.match(/Photo : (https?:\/\/[^\s]+)/);
  return urlMatch ? urlMatch[1] : '';
}
  selectChat(chat: any): void {
    this.selectedChat = { ...chat };
    // Mock some messages for the selected chat (replace with API call if needed)
    this.isLoading = true;
    this.chatID = chat.chatId;
    this.messageService.getLastMessages(chat.chatId, 0).subscribe((response) => {
      if (response && response.length > 0) {
      
        this.messages = [...response.reverse() ];
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
        // this.cdRef.detectChanges();  
  
      }
      this.isLoading = false;
    });
  
  }
  
 
  getUserId() {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.user = JSON.parse(userData);
      this.userId = this.user.user_id; // Get the user ID from localStorage
    } else {
      // Handle the case when user data is not available
      console.error('User data not found in localStorage');
      return;
    }
  }

  clearImage(): void {
    this.selectedImage = null;
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    if (input) input.value = ''; // Clear file input
  }


  sendMessage() {
    if (!this.newMessage.trim()) return;

    const request: AdminMessageRequest = {
      chatId: this.chatID,
      text: this.newMessage,
   // Change dynamically if needed
      adminId: this.userId,
      // mediaUrl:"",    // URL of media file (optional)
      // mediaType:"",
    };

    this.messageService.sendMessage(request).subscribe(response => {
     
      this.refresh();
      // this.messages.push(this.newMessage);
      // console.table(this.messages);// Add response message to chat
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }, error => {
      console.error('Error sending message:', error);
    });
  }

  refresh(){
    this.isLoading = true;
    this.messageService.getLastMessages(this.chatID, 0).subscribe((response) => {
     this.messages =[];
     this.messages = response.reverse();
      this.isLoading = false;
    });
  
  }

  triggerFileUpload(type: string): void {
    this.fileAcceptType = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt'; // Adjust accepted file types
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const type = this.fileAcceptType.includes('image') ? 'image' : 'document';
      let preview: string | null = null;

      if (type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview = e.target?.result as string;
          this.selectedFile = { type, preview, name: file.name, file };
        };
        reader.readAsDataURL(file); // Convert image to base64 for preview
      } else {
        // For documents, just store the file name and type (no preview needed)
        this.selectedFile = { type, preview: null, name: file.name, file };
      }
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = ''; // Clear file input
    this.fileAcceptType = ''; // Reset accepted file types
  }

  // Method to check if the message contains an image URL
  // isImageMessage(message: string): boolean {
  //   return message.startsWith('Photo : ') && message.includes('http');
  // }

  // Method to check if the message contains a document URL
  isDocumentMessage(message: string): boolean {
    return message.startsWith('Document : ') && message.includes('http');
  }

  // Method to extract the URL from the "<Type> : <URL>" format
  getFileUrl(message: string): string {
    const urlMatch = message.match(/(Photo|Document) : (https?:\/\/[^\s]+)/);
    return urlMatch ? urlMatch[2] : '';
  }

  // Method to extract the file name from the URL (optional, for display)
  getFileName(message: string): string {
    const url = this.getFileUrl(message);
    if (url) {
      return url.split('/').pop() || 'Document';
    }
    return 'Document';
  }

  // Method to parse the message and handle "<Type> : <URL>" format
  parseMessage(message: string): string {
    if (this.isImageMessage(message) || this.isDocumentMessage(message)) {
      return message; // Keep the original format for display logic
    }
    return message;
  }

  private formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

}
