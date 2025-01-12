export interface Operation {
    id: number
    zuserID: number
    status: string
    time: string
    operation: string
    userName: string
    amount: string
    operationNumber?:number
    utrnumber?:number 
  }

export const Operations : Operation[] =[
    {
      id: 387,
      zuserID: 56,
      status: "In Process",
      time: "2024-04-18T08:32:17",
      operation: "withdrawal",
      userName: "Alice",
      amount: "758",
      operationNumber:2
    },
    {
      id: 942,
      zuserID: 89,
      status: "Success",
      time: "2024-04-18T15:21:45",
      operation: "deposit",
      userName: "Bob",
      amount: "215"
    },
    {
      id: 523,
      zuserID: 42,
      status: "Filed",
      time: "2024-04-18T11:45:03",
      operation: "transfer",
      userName : "Charlie",
      amount : "437"
    },
    {
      id : 189,
      zuserID: 73,
      status: "Success",
      time : "2024-04-18T17:59:28",
      operation : "withdrawal",
      userName : "David",
       amount : "901"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    },
    {
      id: 523,
      zuserID: 42,
      status: "Failed",
      time: "2024-04-18T11:45:03",
      operation: "transfer",
      userName : "Charlie",
      amount : "437"
    },
    {
      id : 189,
      zuserID: 73,
      status: "Success",
      time : "2024-04-18T17:59:28",
      operation : "withdrawal",
      userName : "David",
       amount : "901"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    },
    {
      id: 671,
      zuserID: 19,
      status: "In Process",
      time: "2024-04-18T09:47:56",
      operation: "deposit",
      userName: "Eva",
      amount: "632"
    }
  ]
  