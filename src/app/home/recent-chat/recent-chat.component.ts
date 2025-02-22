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

  constructor( private titleService: ComponettitleService ,private chatService: ChatBotService,private messageService: ChatBotService , private cdRef: ChangeDetectorRef ) { }
  messages: any[] = [];
  recentChats: any[] = [];
  selectedChat: any = null;
  newMessage: string = '';
  mockMessages: any[] = [];
 @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
 private refreshInterval: any;

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

}
