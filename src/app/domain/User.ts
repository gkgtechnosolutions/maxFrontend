import { SITE } from "./Site";

export interface USER {
  token?: string;
  id?: number;
  username?: String;
  password?: String;
  role?: String;
}
export interface SiteUser {
  userId: string;
  password: string;
  name?: string;
  balance?: string;
  creditReference?: string;
  betStatus?: boolean;
  activeStatus?: boolean;
  site_id?: number;
  id?: number;
  masterId?: number;
  utrNumber?: string;
  date?: string;
  dtoZuser?: USER;
  site?: SITE;
}

export interface USER1 
  {user_email?:string,
  role_user?:string,
  user_id?:number,
  iat?:number}


 
  
