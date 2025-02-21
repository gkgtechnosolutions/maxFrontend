export interface TeleMessage {
    id: number;
    message: string;
    sender: 'USER' | 'BOT' | 'ADMIN';
  }

export interface AdminMessageRequest {
    adminId: number;      // ID of the admin sending the message
    chatId: string;       // Telegram Chat ID of the recipient
    text: string;        // Message text (optional)
    mediaUrl?: string;    // URL of media file (optional)
    mediaType?: string;   // Type of media (photo/document)
}

export interface TeleUser {
  id: number;
  chatId?: string;
  firstName?: string;
  langPreferenceCode?: number;
  bankDetails?: ClientBankDetails[];
}

// Required related interface for ClientBankDetails
export interface ClientBankDetails {
 
  id?: number;  // Assuming it has an ID
  teleUser?: TeleUser;  // Reference back to TeleUser

}