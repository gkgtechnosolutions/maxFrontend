import { DtoZuser, Site } from "./Deposite";

export interface lastWeekDeposit {
    id: number;
    userId: string;
    utrNumber: string;
    amount: string;
    date: string;
    status: string;
    site: Site; 
    dtoZuser: DtoZuser; 
    reportID: number;
  }



export interface Page<T> {
    content: T[];
    totalElements: number;
    size: number;
    number: number;
  }