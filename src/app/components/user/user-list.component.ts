import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router, Params } from '@angular/router';
import { UserService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
//import { I18nProvider } from 'src/app/providers/I18nProvider';
import { lang } from 'moment';
import { ActivityService } from 'src/app/services/activity.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

/* import {
  SpeechRecognitionService
} from '@kamiazya/ngx-speech-recognition';
 */
import { MatDialog } from '@angular/material';
import { DialogDateRangeComponent } from '../dialog/dialog-date-range.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private startDay = 3; // Wednerday;
  private datePipe = new DatePipe('en-US');
  public searchValue = '';
  public users: Array<any>;
  public started = false;

  constructor(
    private router: Router,
    /* private speechService: SpeechRecognitionService, */
    public authService: AuthService,
    public dialog: MatDialog,
    //private i18nProvider: I18nProvider,
    private translate: TranslateService,
    private userService: UserService,
    private excelService: ExcelService,
    private activityService: ActivityService
  ) {
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');

/*
    this.speechService.onstart = (e) => {
      this.started = true;
    };
    this.speechService.onend = (e) => {
      this.started = false;
    };
    this.speechService.onresult = (e) => {
      this.stopSpeech();
      this.searchValue = e.results[0].item(0).transcript;
      this.searchByName();
    };
 */
  }
/*
  startSpeech() {
    if (!this.started) {
      this.speechService.start();
    }
  }

  stopSpeech() {
    if (this.started) {
      this.speechService.stop();
    }
  }
 */
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.userService.getAll()
    .subscribe(result => {
      let order1;
      let order2;
      this.users = result.sort((user1: any, user2: any) => {
        order1 = parseInt(user1.payload.doc.data().order, 10);
        order2 = parseInt(user2.payload.doc.data().order, 10);
        return order1 - order2;
      });
    });
  }

  viewDetails(user){
    this.router.navigate(['/user/edit/' + user.payload.doc.id]);
  }

  listActivities(user) {
    localStorage.setItem('idUserSelected', user.payload.doc.id);
    localStorage.setItem('userSelected', JSON.stringify(user.payload.doc.data()));
    this.router.navigate(['/activity']);
  }

  searchByName() {
    let value = this.searchValue.toLowerCase();
    value = value.charAt(0).toUpperCase() + value.slice(1);
    this.userService.searchByNameStart(value)
    .subscribe(result => {
      let order1;
      let order2;
      this.users = result.sort((user1: any, user2: any) => {
        order1 = parseInt(user1.payload.doc.data().order, 10);
        order2 = parseInt(user2.payload.doc.data().order, 10);
        return order1 - order2;
      });
    });
  }

  searchByUserNameStart() {
    const value = this.searchValue.toLowerCase();
    this.userService.searchByUserNameStart(value)
    .subscribe(result => {
      let order1;
      let order2;
      this.users = result.sort((user1: any, user2: any) => {
        order1 = parseInt(user1.payload.doc.data().order, 10);
        order2 = parseInt(user2.payload.doc.data().order, 10);
        return order1 - order2;
      });
    });
  }

  generateExcelData(activities: any) {
    // send mail.
    //this.emailService.send({});
    const daySeconds = 8 * 3600;
    let reporter;
    let estimate = 1;
    let worked = 1;
    let remaining = 0;
    let workdate;
    const length = activities.length;
    const excelData = [];
    for (let index = 0; index < length; index++) {
        const activity = activities[index];
        reporter = this.userService.users[activity.owner].name;
        estimate = 1;
        remaining = 0;
        if (activity.status.toLowerCase() === 'In Progress'.toLowerCase()) {
            estimate += 1;
            remaining += 1;
        }
        worked = estimate - remaining;
        workdate = this.datePipe.transform(activity.workDate, localStorage.getItem('dateFormat'));
        const worklogDay = 'Coding;' + workdate + ';' + this.userService.users[activity.owner].account + ';' + (worked);
        const worklog = 'Coding;' + workdate + ';' + this.userService.users[activity.owner].account + ';' + (worked * daySeconds);
        const data = {};
        data['Project Name'] = activity.projectName;
        data['Project key'] = null;
        data['Summary'] = activity.code.charAt(0).toUpperCase() + activity.code.slice(1);
        data['Issue Type'] = activity.type;
        data['Reporter'] = activity.reportTo;
        data['Assignee'] = this.userService.users[activity.owner].account;
        data['Start Date'] = workdate;
        data['Due Date'] = workdate;
        data['Original Estimate (day)'] = estimate;
        data['Worked (day)'] = worked;
        data['Remaining (day)'] = remaining;
        data['Status (day)'] = activity.status;
        data['Worklog (comment;date_for_logwork;account;second) (day)'] = worklogDay;
        data['Original Estimate'] = estimate * daySeconds;
        data['Remaining'] = remaining * daySeconds;
        data['Status'] = activity.status;
        data['Worklog (comment;date_for_logwork;account;second)'] = worklog;
        // push.
        excelData.push(data);
    }
    // return.
    return excelData;
  }

  exportDailyAsExcelFile(): void {
    const dataFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dataFormat).toString();
    const fromDate = moment.utc(currentDate, dataFormat.toUpperCase());
    const toDate = moment.utc(currentDate, dataFormat.toUpperCase());
    const dialogData: any = { title: this.translate.instant('user.choseDate'), 
      fromDate: fromDate, toDate: toDate, 
      fromDateTitle: this.translate.instant('user.fromDate'), toDateTitle: this.translate.instant('user.toDate'), 
      cancel: this.translate.instant('user.cancel'), ok: this.translate.instant('user.ok')
    };
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
        data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (dialogData.result !== null) {
        const fromDate = dialogData.result.fromDate;
        const toDate = dialogData.result.toDate;
        const datePipe = this.datePipe;
        const sheets = {};
        const sheetRows = [];
        const sheetNames: string[] = [];
        this.users.forEach((user: any) => {
          const owner = user.payload.doc.id;
          const sheetName: string = user.payload.doc.data().userName.replace('@fsoft.com.vn', '').toUpperCase();
          if (owner) {
            this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate).then((activities: any[]) => {
              // Sort by workDate.
              if (activities.length > 0) {
                activities = activities.sort((item1: any, item2: any) => {
                  // value1.
                  let value1 = item1.workDate;
                  //const numbers1 = value1.match(/\d+/g);
                  //value1 = new Date(numbers1[2], numbers1[1] - 1, numbers1[0]);
                  value1 = datePipe.transform(value1, 'yyyyMMdd').toString();
                  // value2.
                  let value2 = item2.workDate;
                  //const numbers2 = value2.match(/\d+/g);
                  //value2 = new Date(numbers2[2], numbers2[1] - 1, numbers2[0]);
                  value2 = datePipe.transform(value2, 'yyyyMMdd').toString();
                  // compare workDate asc.
                  if (value1 < value2) { return -1; }
                  if (value1 > value2) { return 1; }
                  return 0;
                });
              }
              // Generate data for excel.
              sheetRows.push(this.generateExcelData(activities));
              sheetNames.push(sheetName);
              if (sheetRows.length === this.users.length) {
                this.excelService.exportDailyAsExcelFile(sheetRows, sheetNames, 'Work logs(2Teams)');
              }
            }).catch(error => {
            });
          } else {
            sheetRows.push([]);
            sheetNames.push(sheetName);
          }
        });
      }
    });
  }

  generateExcelDataForWeekly(order, userName, fullName, activities: any[]) {
    let projectName = '';
    let data: any;
    const excelData = [];
    const length = activities.length;
    for (let index = 0; index < length; index++) {
      const activity = activities[index];
      if (projectName !== activity.projectName) {
        projectName = activity.projectName;
        data = {};
        data['Order'] = order;
        data['User Name'] = userName;
        data['Display Name'] = fullName;
        data['Detail'] = activity.code;
        data['Tasks status'] = activity.status;
        data['Workload/Project'] = 1;
        data['Project'] = activity.projectName;
        data['Ready for new task'] = 'Yes';
        // push.
        excelData.push(data);
      } else {
        data['Tasks status'] = activity.status;
        data['Workload/Project'] = data['Workload/Project'] + 1;
      }
    }
    excelData.forEach((data) => {
      const status = data['Tasks status'].toUpperCase();
      if (status === 'DONE' || status === 'FIXED') {
        data['Tasks status'] = 1;
      } else {
        data['Tasks status'] = 0.5;
        data['Ready for new task'] = 'No';
      }
      data['Workload/Project'] = data['Workload/Project'] / length;
    })
    // return.
    return excelData;
  }

  exportWeeklyAsExcelFile(): void {
    const dataFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dataFormat).toString();
    let fromDate = moment.utc(currentDate, dataFormat.toUpperCase());
    while ((fromDate.weekday() + 7) % 7 !== this.startDay) {
      fromDate = fromDate.add(-1, 'd');
    }
    const toDate = moment.utc(currentDate, dataFormat.toUpperCase());
    const dialogData: any = { title: this.translate.instant('user.choseDate'), 
      fromDate: fromDate, toDate: toDate, 
      fromDateTitle: this.translate.instant('user.fromDate'), toDateTitle: this.translate.instant('user.toDate'), 
      cancel: this.translate.instant('user.cancel'), ok: this.translate.instant('user.ok')
    };
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
        data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (dialogData.result !== null) {
        const fromDate = dialogData.result.fromDate;
        const toDate = dialogData.result.toDate;
        const sheetRows = [[], [], []];
        const sheetNames: string[] = ['Projects Overview', 'Projects Members', 'Projects Note'];
        const membersSheet: any[] = [];
        sheetRows.push(membersSheet);
        sheetNames.push('Members');
        let count = 0;
        let activities;
        let user;
        let userActivities = {};
        let owners = {};
        const length = this.users.length;
        for (let index = 0; index < length; index++) {
          userActivities[index.toString()] = [];
          user = this.users[index];
          let owner = user.payload.doc.id;
          owners[index.toString()] = user.payload.doc.data();
          //console.log(user.payload.doc.data());
          if (owner) {
            count++;
            this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate).then((response: any[]) => {
              count--;
              activities = response;
              if (activities.length > 0) {
                const datePipe = this.datePipe;
                // Sort by projectName and workDate.
                activities = activities.sort(function(item1: any, item2: any) {
                  // compare projectName asc.
                  if (item1.projectName < item2.projectName) { return -1; }
                  if (item1.projectName > item2.projectName) { return 1; }
                  // value1.
                  let value1 = item1.workDate;
                  value1 = datePipe.transform(value1, 'yyyyMMdd').toString();
                  // value2.
                  let value2 = item2.workDate;
                  value2 = datePipe.transform(value2, 'yyyyMMdd').toString();
                  // compare workDate asc.
                  if (value1 < value2) { return -1; }
                  if (value1 > value2) { return 1; }
                  return 0;
                });
                userActivities[index.toString()] = activities;
              }
              if (count === 0) {
                for (let index = 0; index < length; index++) {
                  activities = userActivities[index.toString()];
                  owner = owners[index.toString()];
                  const order = owner.order;
                  const userName = owner.userName;
                  const fullName = owner.surname + ' ' + owner.name;
                  if (activities.length > 0) {
                    // Generate data for excel.
                    activities = this.generateExcelDataForWeekly(order, userName, fullName, activities);
                  } else {
                    const data = {};
                    data['Order'] = order;
                    data['User Name'] = userName;
                    data['Display Name'] = fullName;
                    data['Detail'] = 'Miss';
                    data['Tasks status'] = 0;
                    data['Workload/Project'] = 0;
                    data['Project'] = '';
                    data['Ready for new task'] = 'Yes';
                    activities.push(data);
                  }
                  membersSheet.push(...activities);
                }
                this.excelService.exportDailyAsExcelFile(sheetRows, sheetNames, 'Weekly report Mainternance team AIA');
              }
            }).catch(error => {
              console.log(error);
            });
          }
        }// for.
      }
    });
  }

}
