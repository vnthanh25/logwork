import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { LogCountService } from '../../services/logcount.service';
import { UserService } from 'src/app/services';
import { ActivityService } from 'src/app/services/activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private startDay = 3; // Wednerday;
  private datePipe = new DatePipe('en-US');
  private defaultColor = { borderColor: 'black', backgroundColor: 'black' };
  private memberColors = {
    'dunghq3': { borderColor: 'black', backgroundColor: '#E52B50' },
    'phuongntl6': { borderColor: 'black', backgroundColor: '#FF00AF' },
    'manhbv1': { borderColor: 'black', backgroundColor: '#9966CC' },
    'hocdd': { borderColor: 'black', backgroundColor: '#FBCEB1' },
    'bactn': { borderColor: 'black', backgroundColor: '#7FFFD4' },
    'longndp': { borderColor: 'black', backgroundColor: '#50C878' },
    'lamtt6': { borderColor: 'black', backgroundColor: '#89CFF0' },
    'anhhdt1': { borderColor: 'black', backgroundColor: '#964B00' },
    'thanhvn5': { borderColor: 'black', backgroundColor: '#007FFF' },
    'nghiath5': { borderColor: 'black', backgroundColor: '#00FF3F' },
    'thanhvq': { borderColor: 'black', backgroundColor: '#FFD700' },
    'tuantm13': { borderColor: 'black', backgroundColor: '#008000' },
    'liemntt': { borderColor: 'black', backgroundColor: '#4B0082' },
    'truongln': { borderColor: 'black', backgroundColor: '#008080' },
    'dungtm10': { borderColor: 'black', backgroundColor: '#964B00' }
  }
  public lineChartColors: Color[] = [
    this.defaultColor
  ];
  public lineChartData: ChartDataSets[] =
  [
    { "data": [0, 0], "label": 'userName' }
  ];
  public lineChartLabels: Label[] = ['Members'];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Log count'
        },
        ticks: {
          min: -1, // it is for ignoring negative step.
          beginAtZero: true,
          stepSize: 1  // if i use this it always set it '1', which look very awkward if it have high value  e.g. '100'.
        }
      }]
    }
  };
  
  public lineChartLegend = true;
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private logCountService: LogCountService
  ) {
  }

  ngOnInit() {
    const dataFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dataFormat).toString();
    let fromDate = moment.utc(currentDate, dataFormat.toUpperCase());
    while ((fromDate.weekday() + 7) % 7 !== this.startDay) {
      fromDate = fromDate.add(-1, 'd');
    }
    const toDate = moment.utc(currentDate, dataFormat.toUpperCase());
    // Data.
    this.userService.getAll().subscribe(users => {
      this.lineChartData = [];
      this.lineChartColors = [];
      const length = users.length;
      let count = 0;
      for (let index = 0; index < length; index++) {
        const user: any = users[index];
        const owner = user.payload.doc.data().id;
        const userName = user.payload.doc.data().userName.replace('@fsoft.com.vn', '');
        if (owner) {
          count++;
          const workDates: string[] = [];
          let workDate: string;
          this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate).then((activities: any[]) => {
            count--;
            const datePipe = this.datePipe;
            let data = { data: [-1, 0], label: userName };
            let logCount = 0;
            if (activities.length > 0) {
              activities.forEach((activity: any) => {
                workDate = datePipe.transform(activity.workDate, 'yyyyMMdd').toString();
                if (workDates.indexOf(workDate) < 0) {
                  logCount++;
                  workDates.push(workDate);
                }
              });
              data = { data: [logCount, 0], label: userName };
            }
            this.lineChartData.push(data);
            let color = this.memberColors[userName];
            if (!color) {
              color = this.defaultColor;
            }
            this.lineChartColors.push(color);
          });
        }
      }
    });
  }
}
