import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SuperAdminLandingService } from '../../services/super-admin-landing.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { ChartsService } from '../../services/charts.service';
import { MatDialog } from '@angular/material/dialog';
import { UsertableModalComponent } from '../usertable-modal/usertable-modal.component';
import { ComponettitleService } from '../../services/componenttitle.service';

@Component({
  selector: 'app-landingpage',

  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class LandingpageComponent implements OnInit {
  todayDeposit: number = 0;
  todayWithdraw: number = 0;
  totalusers: number = 0;
  todayClients: number= 0;
  name = '';
  previousData: any = {};
  deposit: any;
  previousDeposit: number;
  private depositSubscription: Subscription;
  chartDepositData: any[];
  charrtWithdrawData: any[];

  currentdepo: number;
  canvasDeposit: any;
  ctxDeposit: any;
  canvasWithdraw: any;
  ctxWithdraw: any;

  @ViewChild('depositChart') depositChart;
  @ViewChild('withdrawChart') withdrawChart;
  loader: boolean = false;

  constructor(
    private route: Router,
    private landingservice: SuperAdminLandingService,
    private cdRef: ChangeDetectorRef,
    private chartDataService: ChartsService,
    public dialog: MatDialog,
    private   titleService:ComponettitleService
   
  ) {}

  ngOnInit(): void {
    this.titleService.changeTitle('Dashboard panel');
    this.fetchData();
  }

  fetchData() {
    this.getUser();
    this.getDeposite();
    this.getWithdraW();
    this.getDepositChartData();
    this.getWithdrawChartData();
  }

  getDeposite() {
    this.landingservice.getTodaysDeposit().subscribe(
      (data) => {
        if (data != this.currentdepo || this.todayDeposit === 0) {
          this.todayDeposit = data;
          this.currentdepo = this.todayDeposit;
        }
        //  else{
        //   this.todayDeposit=0;
        //  }
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  getClientCount() {
    this.landingservice.getTodaysClient().subscribe(
      (data) => {
        if (data != this.currentdepo || this.todayDeposit === 0) {
          this.todayClients = data;
        }
      },
      (error) => {
        console.error(error);
      
      }
    );
  }

  getWithdraW() {
    this.landingservice.getTodaysWithdraw().subscribe(
      (data) => {
        this.todayWithdraw = data;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  getUser() {
    this.landingservice.getUser().subscribe(
      (data) => {
        this.totalusers = data;
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  dataChanged(newData: any): boolean {
    // Compare new data with previous data
    // Implement your comparison logic here based on your data structure
    // For simplicity, assuming newData and previousData are JSON objects
    return JSON.stringify(newData) !== JSON.stringify(this.previousData);
  }

  getDepositChartData() {
    this.chartDataService.getDepositChartData().subscribe(
      (data) => {
        console.log(data);
        //===============================================================
        this.canvasDeposit = this.depositChart.nativeElement;
        this.ctxDeposit = this.canvasDeposit.getContext('2d');

        let depositChart = new Chart(this.ctxDeposit, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Deposits',
                backgroundColor: 'rgba(255, 99, 132,0.4)',
                borderColor: 'rgb(255, 215, 0)',
                fill: true,
                data: data.map(([x, y]) => ({
                  x,
                  y,
                })),
              },
            ],
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: 'Deposits Over Time',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'day',
                    displayFormats: {
                      month: 'MMM YYYY',
                    },
                  },
                  scaleLabel: {
                    labelString: 'Date',
                    display: true,
                  },
                },
              ],
              yAxes: [
                {
                  type: 'linear',
                  ticks: {
                    userCallback: function (tick) {
                      return tick.toString();
                    },
                  },
                  scaleLabel: {
                    labelString: 'Deposits',
                    display: true,
                  },
                },
              ],
            },
          },
        });

        this.chartDepositData = data.map(([x, y]) => ({
          x,
          y,
        }));

        console.log(this.chartDepositData);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getWithdrawChartData() {
    this.chartDataService.getWithdrawalChartData().subscribe(
      (data) => {
        console.log(data);
        this.canvasWithdraw = this.withdrawChart.nativeElement;
        this.ctxWithdraw = this.canvasWithdraw.getContext('2d');

        let withdrawChart = new Chart(this.ctxWithdraw, {
          type: 'line',
          data: {
            datasets: [
              {
                label: 'Withdrawals',
                backgroundColor: 'rgba(54, 162, 235, 0.4)',
                borderColor: 'rgb(255, 215, 0)',
                fill: true,
                data: data.map(([x, y]) => ({
                  x,
                  y,
                })),
              },
            ],
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: 'Withdrawals Over Time',
            },
            scales: {
              xAxes: [
                {
                  type: 'time',
                  time: {
                    unit: 'day',
                    displayFormats: {
                      month: 'MMM YYYY',
                    },
                  },
                  scaleLabel: {
                    labelString: 'Date',
                    display: true,
                  },
                },
              ],
              yAxes: [
                {
                  type: 'linear',
                  ticks: {
                    userCallback: function (tick) {
                      return tick.toString();
                    },
                  },
                  scaleLabel: {
                    labelString: 'Withdrawals',
                    display: true,
                  },
                },
              ],
            },
          },
        });

        //   this.charrtWithdrawData=Object.entries(data).map(([date, count]) => ({
        //     date,
        //     count
        // }))
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //   ngOnInit(): void {
  //    this.getDeposite();
  //    this.getWithdraW();
  //    this.getUser();
  //   }

  // getDeposite(){
  //   this.loaderdeposite=true;
  //   this.landingservice.getDeposite().subscribe(
  //     (data) => {

  //       this.loaderdeposite=false;
  //       this.todayDeposit=data;

  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // getWithdraW(){
  //   this.loaderwithdraw=true;
  //   this.landingservice.getWithdraw().subscribe(
  //     (data) => {

  //       this.loaderwithdraw=false;
  //       this.todayWithdraw=data;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );

  // }

  // getUser(){
  //   this.loaderusers=true;
  //   this.landingservice.getUser().subscribe(
  //     (data) => {

  //       this.loaderusers=false;
  //       this.totalusers=data;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  navigateToPage(component: String): void {
    this.route.navigateByUrl(`SA/${component}`);
  }

  // =============================chart===================================================
  ngAfterViewInit() {}

  //==================================chart pro===================================

  // private createChart(canvas: HTMLCanvasElement, data: any, label: string, backgroundColor: string) {
  //   const ctx = canvas.getContext('2d');
  //   new Chart(ctx, {
  //     type: 'line',
  //     data: {
  //       datasets: [{
  //         label: label,
  //         backgroundColor: backgroundColor,
  //         borderColor: "rgb(255, 215, 0)",
  //         fill: true,
  //         data: data,
  //       }]
  //     },
  //     options: {
  //       Add your chart options here
  //     }
  //   });
  // }

  // ngAfterViewInit() {
  //   this.chartDataService.getDepositChartData().subscribe(data => {
  //     this.createChart(this.depositChart.nativeElement, data, 'Deposits', 'rgba(255, 99, 132,0.4)');
  //   });

  //   this.chartDataService.getWithdrawalChartData().subscribe(data => {
  //     this.createChart(this.withdrawChart.nativeElement, data, 'Withdrawals', 'rgba(54, 162, 235, 0.4)');
  //   });
  // }

  //************************************  usertable modal ************************* */

  fetchDataFromBackend() {
    this.loader = true;
    // Perform backend API call or any other method to fetch data
    this.landingservice.getAllUsers().subscribe(
      (data) => {
        // Pass the fetched data to the openDialog method
        console.log(data);
        this.openDialog(data);
        this.loader = false; // Set loader to false after data is fetched
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.loader = false; // Set loader to false if there's an error
      }
    );
  }
  openDialog(tableData: any): void {
    this.dialog.open(UsertableModalComponent, {
      width: '70%',
      data: { tableData },
    });
  }


}
