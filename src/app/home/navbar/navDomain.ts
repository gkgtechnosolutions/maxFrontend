export interface navDomain {
  routerLink: string,
  icon: string,
  title: string,

}
export const USER: navDomain[] =[
  { routerLink: 'dashboard', icon: "Home",title: "Home"},
  // { routerLink: 'deposit', icon: "download", title: "Deposit" },
  {routerLink: 'watti-chat',icon: "group", title: "Chat"},
  // { routerLink: 'withdraw', icon: "upload", title: "Withdraw" },
  // { routerLink: 'reports', icon: "Report", title: "Report" },
  // { routerLink: 'add', icon: "person_add", title: "Add User" },
  // { routerLink: 'Add-Old', icon: "person_add", title: "Add Old User" },
  // { routerLink: 'update', icon: "key", title: "Update Password" },
  // { routerLink: 'users', icon: "group", title: "Users" },
  // { routerLink: 'add-site', icon: "web", title: "Site" },
  // { routerLink: 'site-master', icon: "web", title: "Site Master" },
  // { routerLink: 'site-user', icon: "web", title: "Site User" },
  // { routerLink: 'AppvDeposit', icon: "Download", title: "App-Deposit" },
  // { routerLink: 'AppvDList', icon: "List", title: "A-DList" },
  // { routerLink: 'Bank', icon: "Money", title: "Add-Bank" },

]

export const admin: navDomain[]=[
  { routerLink: 'dashboard', icon: "Home",title: "Home"},
  { routerLink: 'deposit', icon: "download", title: "Deposit" },
  { routerLink: 'withdraw', icon: "upload", title: "Withdraw" },
  { routerLink: 'reports', icon: "Report", title: "Report" },
  { routerLink: 'add', icon: "person_add", title: "Add User" },
  { routerLink: 'Add-Old', icon: "add", title: "Add Old User" },
  { routerLink: 'update', icon: "key", title: "Update Password" },
  // { routerLink: 'users', icon: "group", title: "Users" },
  // { routerLink: 'add-site', icon: "web", title: "Site" },
  // { routerLink: 'site-master', icon: "web", title: "Site Master" },
  // { routerLink: 'site-user', icon: "web", title: "Site User" },
  // { routerLink: 'AppvDeposit', icon: "Download", title: "Download" },
  // { routerLink: 'AppvDList', icon: "List", title: "A-DList" },
  // { routerLink: 'Bank', icon: "Money", title: "Add-Bank" },
  // { routerLink: 'Tel-Users', icon: "group", title: "Tel-Users" },
  // { routerLink: 'Banking Panel', icon: "group", title: "Banking Panel" },

]

export const APPROVEDEPOSIT : navDomain[] = [
  { routerLink: 'AppvDList', icon: "List", title: "A-DList" },
  { routerLink: 'approve', icon: "List", title: "Approve" },
  { routerLink: 'AppvWlist', icon: "List", title: "A-WList" },
  // { routerLink: 'users', icon: "group", title: "Users" },
  {routerLink: 'watti-chat',icon: "group", title: "Chat"}
  // { routerLink: 'notification', icon: "notifications", title: "Notify" },
 
]

export const SUPPORT : navDomain[] = [
  { routerLink: 'notification', icon: "notifications", title: "Notify" },

 
]

export const BANKER : navDomain[] = [
  { routerLink: 'Banking Panel', icon: "group", title: "Banking Panel" },
  { routerLink: 'AppvDList', icon: "List", title: "A-DList" },
  { routerLink: 'approve', icon: "List", title: "Approve" },
 
]

export const  DEPOSIT : navDomain[] = [
  { routerLink: 'AppvDeposit', icon: "cloud_upload", title: "A-Deposit" },
  { routerLink: 'deposit', icon: "download", title: "Deposit" },
  { routerLink: 'Bank', icon: "Money", title: "Add-Bank" },
  { routerLink: 'users', icon: "group", title: "Users" },
  { routerLink: 'add', icon: "person_add", title: "Add New User" },
  { routerLink: 'Add-Old', icon: "person_add", title: "Add Old User" },
  { routerLink: 'update', icon: "key", title: "Update Password" },
]

export const APPROVEWITHDRAW : navDomain[] = [
  // { routerLink: 'AppvDList', icon: "List", title: "A-DList" },
  // { routerLink: 'approve', icon: "List", title: "Approve" },
  { routerLink: 'AppvWlist', icon: "List", title: "A-WList" },
  { routerLink: 'users', icon: "group", title: "Users" },
 
]

export const  APPROVEADMIN : navDomain[] = [
  { routerLink: 'appv-home', icon: "home", title: "Home" },
  { routerLink: 'Tel-Users', icon: "group", title: "Tel-Users" },

  { routerLink: 'SupADeposit', icon: "download", title: "Sup ADeposit" },
  { routerLink: 'SupAWithdraw', icon: "upload", title: "Sup AWithdraw" },
  { routerLink: 'user-panel', icon: "group", title: "User panel" },
]