import { Bank, BankAccount } from "./Bank";

export interface AppvDeposit{
 isNewId: any;
 requestBy: requestBy;
  bankUtrImageLink: any;
  id: number,
  userId: string,
  utrNumber: string,
  amount: string,
  entryTime: Date,
  status: string,
  site: Site,
  bank: Bank,
  dtoZuser: DtoZuser,
  reportID: number,
  bankDetails: BankAccount,
  approveStatus: string,
  rejectReason: string,
}

export interface appvWithdraw {
  userId?: string;                
  utrNumber?: string;
  amount?: string;
  entryTime?: Date;
  id?: number;                    
  bankId?: number;
  retry?: boolean;
  approveId?: number;
  status?: string;
  bankUtrImageLink?: string;
  chatID?: string;
  rejectionReason?: string;
  withdrawMessage?: string;

}

export interface requestBy{
  id: number,
  username: string,
  password: string,
  role: string,
}
export interface ADeposit{
  id: number,
  userId: string,
  utrNumber: string,
  amount: string,
  date: Date,
  status: string,
  site: Site,
  dtoZuser: DtoZuser,
  reportID: number,
  bankDetails: BankAccount,
}

export interface DepositeWithdraw {
  id: number;
  userId: string;
  utrNumber: string;
  amount: string;
  totalAmount?: string;
  date: string;
  siteMasterId?: number;
  zuserId: number;
  siteId: number;
}
export interface utrDeposit {
  id: number;
  userId: string;
  utrNumber: string;
  amount: string;
  date: string;
  status: string;
  site :Site;
  
}



export interface Deposite {
  id: number;
  userId: string;
  utrNumber: string;
  amount: string;
  siteMasterTotalAmount: any;
  date: string;
  status: string;
  dtoSiteMaster: DtoSiteMaster;
}

export interface DtoSiteMaster {
  id: number;
  username: string;
  password: string;
  transactionCode: string;
  dtoZuser: DtoZuser;
  site: Site;
}

export interface DtoZuser {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface Site {
  id: number;
  name: string;
  url: string;
}
