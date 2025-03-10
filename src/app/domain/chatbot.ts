export interface TeleMessage {
    id: number;
    message: string;
    sender: 'USER' | 'BOT' | 'ADMIN';
    teleUser?: TeleUser;
    createdAt?: string;
  }

export interface AdminMessageRequest {
    adminId: number;      // ID of the admin sending the message
    chatId: string;       // Telegram Chat ID of the recipient
    text: string;        // Message text (optional)
    mediaUrl?: any;    // URL of media file (optional)
    mediaType?: string;   // Type of media (photo/document)
}

export interface TeleUser {
  id: number;
  chatId?: string;
  firstName?: string;
  langPreferenceCode?: number;
  bankDetails?: ClientBankDetails[];
  phoneNumber?: string;
}

// Required related interface for ClientBankDetails
export interface ClientBankDetails {
 
  id?: number;  // Assuming it has an ID
  teleUser?: TeleUser;  // Reference back to TeleUser

}

export interface Selectedchat {
  chatId?: string;              // "6707613804" -> string
  firstName?: string;           // "Vinay" -> string
  id ?: number;                  // 1 -> number
  langPreferenceCode?: number;  // 0 -> number
  lastMessage?: string;         // "Please Select Your Id :-\n" -> string
  lastMessageTime?: string;     // "2025-03-07T12:17:12" -> string (ISO date format)
  // phoneNumber?: string;         // "1234567890" -> string
}