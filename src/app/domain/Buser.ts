import { Site } from "./Deposite";

export interface Buser{
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    bankAttempts: number;
  }

  export interface ClientUser{
    id: number;
    userId: string;
    password: string;
    name: string;
    balance: string;
    creditReference: string;
    site: Site;
    bUser: Buser;
    masterId: number;
    date: string;
    reportID: number;
  }