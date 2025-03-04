import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminMessageRequest, TeleMessage, TeleUser } from '../../domain/chatbot';
import { ChatBotService } from '../../services/chat-bot.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent implements AfterViewInit {
  @ViewChild('chatContainer', { static: false }) chatContainer!: ElementRef;
  messages: any[] = [];
  newMessage: string = '';
  chatId: string; // Change this dynamically
  page: number = 1;
  isLoading: boolean = false;
  user: any;
  userId: any;
  teleuser: TeleUser;

  constructor(public dialogRef: MatDialogRef<ChatBotComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private messageService: ChatBotService ,
     private cdRef: ChangeDetectorRef,) {
    this.teleuser = data.teleUser;
    this.messages = data.messages || [];
    this.chatId = data.teleUser.chatId;
    this.getUserId();  // Get messages from the parent component
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
  ngAfterViewInit(): void {
    
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    
  }
  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const request: AdminMessageRequest = {
      chatId: this.chatId,
      text: this.newMessage,
   // Change dynamically if needed
      adminId: this.userId,
      // mediaUrl:"",    // URL of media file (optional)
      // mediaType:"",
    };

    this.messageService.sendMessage(this.userId,this.chatId,this.userId).subscribe(response => {
     
      this.refresh();
      // this.messages.push(this.newMessage);
      // console.table(this.messages);// Add response message to chat
      this.newMessage = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }, error => {
      console.error('Error sending message:', error);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

    onScroll() {
    const scrollTop = this.chatContainer.nativeElement.scrollTop;
    if (scrollTop === 0 && !this.isLoading) {
      this.loadMoreMessages();
    }
  }

  /** Load Older Messages */
  loadMoreMessages() {
    const chatContainer = this.chatContainer.nativeElement; // Reference to the chat container
    const previousScrollHeight = chatContainer.scrollHeight; // Store scroll height
    const previousScrollTop = chatContainer.scrollTop; 
    this.isLoading = true;

    this.messageService.getLastMessages(this.chatId, this.page).subscribe((response) => {
      if (response && response.length > 0) {
        debugger;
        this.messages = [...response.reverse(), ...this.messages, ];
       
        this.cdRef.detectChanges();  
        setTimeout(() => {
          const newScrollHeight = chatContainer.scrollHeight;
          chatContainer.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        }, 0);
        this.page++; // Increase page count
      }
      this.isLoading = false;
    });
  

}
refresh(){
  this.isLoading = true;
  this.messageService.getLastMessages(this.chatId, 0).subscribe((response) => {
   this.messages =[];
   this.messages = response.reverse();
    this.isLoading = false;
  });

}
}
