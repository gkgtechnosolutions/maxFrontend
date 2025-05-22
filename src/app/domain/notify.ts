export interface wati {
  id?: string; // Adjust properties based on your backend response
  content?: string;
  sender?: string;
  timestamp?: string;
  // Add other relevant fields
}
export enum AlertType {
  USERNAMEMISSING = 'USERNAMEMISSING',
  USERNOTFOUND = 'USERNOTFOUND',
  UTRALREADYUSED = 'UTRALREADYUSED',
  REJECTEDREQUEST = 'REJECTEDREQUEST',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  // RESOLVED = 'RESOLVED',
  REMOVED = 'REMOVED'
}

export interface Alert {
  id: string;
  conversationId: string;
  text: string;
  data: string;
  timestamp: number;
  waId: string;
  alertMessage: string;
  status: AlertStatus;
  type: AlertType;
  userId?: string; // Optional userId field for USERNOTFOUND type
}