import { Component, OnInit, ViewChild } from '@angular/core';
import { Operation, Operations } from '../../domain/operation';
import { ReportService } from '../../services/report.service';
import { Subscription, debounceTime, fromEvent, interval } from 'rxjs';
import { ComponettitleService } from '../../services/componenttitle.service';
import { DatePipe, formatDate } from '@angular/common';
import { lastWeekDeposit } from '../../domain/lastWeek';
import { SearchsuperadminService } from '../../services/searchsuperadmin.service';
import { DepositSuperadminService } from '../../services/deposit-superadmin.service';
import { LastweekdataService } from '../../services/lastweekdata.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import{ExcelService} from'../../services/excel.service';
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  loader: boolean = false;
  deposits: lastWeekDeposit[] = [];
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;
  cumulativeCount: number = 0; // Track cumulative count across pages
  displayedColumns = ['position', 'userId', 'utrNumber','amount','date','status','siteName','BotUserName' ];
  dataSource:string="Deposit";
  dateRange: { start: Date, end: Date };
  dataSourceType :string;
  StartDate;
  EndDate;
  searchTerm:string;
  inputPage: number;
  data ;
  totalAmount;
  excelData;

  constructor(
    private searchService: SearchsuperadminService,
    private depositService: DepositSuperadminService,
    private lastweekdata :LastweekdataService,
    private datePipe: DatePipe,
    private excelService:ExcelService,
  
  ) {
    this.dateRange = { start: null, end: null };
   
   
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit(): void {
  
    this.getdata();
    this.getTodayData()
    this.getTotalAmountdata();
    // this.getRangedata();
    this.inputPage = 1;
  }

  getdata(): void {
    if(this.dataSource ==="Deposit"){
      this.displayedColumns = ['position', 'userId', 'utrNumber','amount','date','status','siteName','BotUserName' ];
      this.dataSwitch();
      
    }else{
     this.displayedColumns = ['position', 'userId', 'amount','date','status','siteName','BotUserName' ];
      this.dataSwitch();
      
    }
    this.getTodayData()
    this.getTotalAmountdata();

  }

  dataSwitch(){
        this.gettotaldata();
        this.getRangedata();
  }





  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.inputPage = this.page + 1;
    console.log("onPageChange");
   if(this.searchTerm){
    this.onEnter(this.searchTerm);

   }else{

  
        if (this.EndDate) {
          this.getRangetotaldata();
      } else {
          this.gettotaldata();
      }

      console.log("outside");
    }
  }

  getSerialNumber(index: number): number {
    // Return the cumulative count plus the index within the current page
    return this.cumulativeCount + index + 1;
  }



  getFormattedDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
}
  




range = new FormGroup({
  start: new FormControl<Date | null>(null),
  end: new FormControl<Date | null>(null),
});


gettotaldata() {
  
  this.loader = true;

  let dataSubscription;
  if (this.dataSource === "Deposit") {
    dataSubscription = this.depositService.getAllDepositdata( this.size, this.page);
  } else if (this.dataSource === "Withdraw") {
    dataSubscription = this.depositService.getAllWithdrawdata( this.size, this.page);
  }

  if (dataSubscription) {
    dataSubscription.subscribe((data: any) => {
      console.log(data);
      this.deposits = data.content;
      console.log(this.deposits);
      this.totalElements = data.totalElements;
      this.cumulativeCount = (this.page * this.size);
      this.loader = false;
    }, (error) => {
      console.log(error);
      this.loader = false;
    });
  } else {
    this.loader = false;
    console.log("Invalid dataSourceType");
  }
}

getTodayData() {
  
  this.loader = true;
console.log("getTodayData");
  let dataSubscription;
  if (this.dataSource === "Deposit") {
    dataSubscription = this.depositService.getTodaysAllDepositdata();
  } else if (this.dataSource === "Withdraw") {
    dataSubscription = this.depositService.getTodaysAllWithdrawdata();
  }

  if (dataSubscription) {
    dataSubscription.subscribe((data: any) => {
      // console.log(data);
      this.excelData=data;
    }, (error) => {
      console.log(error);
      this.loader = false;
    });
  } else {
    this.loader = false;
    console.log("Invalid dataSourceType");
  }
}


getRangedata() {
  console.log("getRangedata");
  this.range.valueChanges.subscribe(values => {
    const startDate = values.start;
    const endDate = values.end;
    this.page = 0;
    // Reset the paginator
    if (this.paginator) {
      this.paginator.firstPage();
    }

    if (startDate && endDate) {
      this.StartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
      this.EndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');

    

      this.loader = true;

      let dataSubscription;
      if (this.dataSource === "Deposit") {
        dataSubscription = this.depositService.getDateDepositdata(this.StartDate, this.EndDate, this.size, this.page);
      } else if (this.dataSource === "Withdraw") {
        dataSubscription = this.depositService.getDateWithdrawdata(this.StartDate, this.EndDate, this.size, this.page);
      }
         
      if (dataSubscription) {
        dataSubscription.subscribe((data: any) => {
       
          this.deposits = data.content;
      
          this.totalElements = data.totalElements;
          this.cumulativeCount = (this.page * this.size);
          this.loader = false;
        }, (error) => {
          console.log(error);
          this.loader = false;
        });
      }
    }
  });
}


getRangetotaldata() {
  this.loader = true;
 
  let dataSubscription;
  if (this.dataSource === "Deposit") {
    dataSubscription = this.depositService.getDateDepositdata(this.StartDate, this.EndDate, this.size, this.page);
  } else if (this.dataSource === "Withdraw") {
    console.log("hello world");
    dataSubscription = this.depositService.getDateWithdrawdata(this.StartDate, this.EndDate, this.size, this.page);
  }

  if (dataSubscription) {
    dataSubscription.subscribe((data: any) => {
      console.log(data);
      this.deposits = data.content;
      console.log(this.deposits);
      this.totalElements = data.totalElements;
      this.cumulativeCount = (this.page * this.size);
      this.loader = false;
    }, (error) => {
      console.log(error);
      this.loader = false;
    });
  } else {
    this.loader = false;
    console.log("Invalid dataSourceType");
  }
}

getTotalAmountdata(){
   
  let dataSubscription;
  if (this.dataSource === "Deposit") {
        dataSubscription = this.searchService.getTotalDepositAmount();
  } else if (this.dataSource === "Withdraw") {
       dataSubscription = this.searchService.getTotalWithdrawAmount();
  }
    dataSubscription.subscribe(
    (data) => {
      console.log("getTodayAmount"+data);
      this.totalAmount = data;
     } , 
    (error) => {
      console.error(error);
    }
  );
}





onEnter(value: string) {
  if(value === ""){
    this.getdata();
  }else{
  // Method called when Enter key is pressed
  console.log('Enter key pressed with:', value);
  this.searchTerm = value;
  this.loader = true;
  // debugger;
  let dataSubscription;
  if (this.dataSource === "Deposit") {
    if (this.StartDate && this.EndDate) {
      dataSubscription = this.searchService.getSearchRangeDepositdata(this.StartDate, this.EndDate, value, this.size, this.page);
    } else {
      dataSubscription = this.searchService.getSearchAllDepositData(value, this.size, this.page);
    }
  } else if (this.dataSource === "Withdraw") {
    if (this.StartDate && this.EndDate) {
      dataSubscription = this.searchService.getSearchRangeWithdrawData(this.StartDate, this.EndDate, value, this.size, this.page);
    } else {
      dataSubscription = this.searchService.getSearchAllWithdrawData(value, this.size, this.page);
    }
  }

  if (dataSubscription) {
    dataSubscription.subscribe((data: any) => {
      console.log(data);
      this.deposits = data.content;
      console.log(this.deposits);
      this.totalElements = data.totalElements;
      this.cumulativeCount = (this.page * this.size);
      this.loader = false;
    }, (error) => {
      console.log(error);
      this.loader = false;
    });
  } else {
    this.loader = false;
    console.log("Invalid dataSourceType");
  }
}
}

 onPageInputChange(event: any) {
    let page = event.target.value - 1;
    if (page >= 0 && page < this.totalElements / this.size) {
      this.page = page;
      this.inputPage = page + 1; // Sync input field with paginator
      this.getdata();
      this.paginator.pageIndex = this.page; // Sync paginator with input field
    }
  }


 resetPage(){ 
     this.page = 0;
     this.inputPage = 1; 

 }


 onToggle(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  this.dataSource = inputElement.checked ?  'Withdraw':'Deposit' ;
  this.getdata();
    // this.getRangedata();
    this.inputPage = 1;

  console.log(this.dataSource); 
}


exportAsXLSX(): void {
  this.loader = true;

  const isDeposit = this.dataSource === "Deposit";

  const exportda = this.excelData.map(o => ({
    UserId: o.userId,
    ...(isDeposit && { UtrNumber: o.utrNumber }), // Include UtrNumber only if dataSource is "Deposit"
    Amount: o.amount,
    Date: this.getFormattedDate(o.date),
    Status: o.status,
    BankName: o.bankDetails.bankName,
    SiteName: o.site.name,
    Botuser: o.dtoZuser.username,
  }));

  // Create total amount row
  const totalAmountRow = {
    UserId: 'Total',
    ...(isDeposit && { UtrNumber: '' }), // Include UtrNumber column if needed
    Amount: this.totalAmount,
    Date: '',
    Status: '',
    SiteName: '',
    Botuser: '',
  };

  // Combine rows for final data
  const finalData = [...exportda, totalAmountRow];

  this.excelService.exportAsExcelFile(finalData, `Todays ${this.dataSource} data`);
  this.loader = false;
}



}
