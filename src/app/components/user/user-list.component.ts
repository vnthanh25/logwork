import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router, Params } from '@angular/router';
import { UserService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { lang } from 'moment';
import { ActivityService } from 'src/app/services/activity.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

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
    public authService: AuthService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private userService: UserService,
    private excelService: ExcelService,
    private activityService: ActivityService
  ) {
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');
  }

  /* Init */
  ngOnInit() {
    this.getData();
  }

  /* Get all users and order by order */
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

  /* Edit selected user */
  viewDetails(user) {
    this.router.navigate(['/user/edit/' + user.payload.doc.id]);
  }

  /* Navigate to activitis of selected user */
  listActivities(user) {
    localStorage.setItem('idUserSelected', user.payload.doc.id);
    localStorage.setItem('userSelected', JSON.stringify(user.payload.doc.data()));
    this.router.navigate(['/activity']);
  }

  /* Search user by exactly name */
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

  /* Search by start name */
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

  /* Generate excel data for daily report */
  generateExcelData(activities: any) {
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
        data['Description'] = activity.summary.charAt(0).toUpperCase() + activity.summary.slice(1);
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

  /* Export to excel file for daily */
  exportDailyAsExcelFile(): void {
    /* Process from date and to date */
    const dateFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dateFormat).toString();
    let fromDate = moment.utc(currentDate, dateFormat.toUpperCase());
    let toDate = moment.utc(currentDate, dateFormat.toUpperCase());
    /* dialogData */
    const dialogData: any = { title: this.translate.instant('user.choseDate'), fromDate, toDate,
      fromDateTitle: this.translate.instant('user.fromDate'), toDateTitle: this.translate.instant('user.toDate'),
      cancel: this.translate.instant('user.cancel'), ok: this.translate.instant('user.ok')
    };
    /* dialog open */
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
        data: dialogData
    });
    /* dialog subscribe */
    dialogRef.afterClosed().subscribe(result => {
      if (dialogData.result !== null) {
        fromDate = dialogData.result.fromDate;
        toDate = dialogData.result.toDate;
        const datePipe = this.datePipe;
        const sheetRows = [];
        const sheetNames: string[] = [];
        this.users.forEach((user: any) => {
          const owner = user.payload.doc.id;
          const sheetName: string = user.payload.doc.data().userName.replace('@fsoft.com.vn', '').toUpperCase();
          if (owner) {
            this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate)
            .then((activities: any[]) => {
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

  /* Generate excel data for weekly of each user */
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
    excelData.forEach((item: any) => {
      const status = item['Tasks status'].toUpperCase();
      if (status === 'DONE' || status === 'FIXED') {
        item['Tasks status'] = 1;
      } else {
        item['Tasks status'] = 0.5;
        item['Ready for new task'] = 'No';
      }
      item['Workload/Project'] = item['Workload/Project'] / length;
    });
    // return.
    return excelData;
  }

  /* Export to excel file for weekly */
  exportWeeklyAsExcelFile(): void {
    /* Process from date and to date */
    const dateFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dateFormat).toString();
    let fromDate = moment.utc(currentDate, dateFormat.toUpperCase());
    while ((fromDate.weekday() + 7) % 7 !== this.startDay) {
      fromDate = fromDate.add(-1, 'd');
    }
    let toDate = moment.utc(currentDate, dateFormat.toUpperCase());
    /* dialogData */
    const dialogData: any = { title: this.translate.instant('user.choseDate'), fromDate, toDate,
      fromDateTitle: this.translate.instant('user.fromDate'), toDateTitle: this.translate.instant('user.toDate'),
      cancel: this.translate.instant('user.cancel'), ok: this.translate.instant('user.ok')
    };
    /* dialog open */
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
        data: dialogData
    });
    /* dialog subscribe */
    dialogRef.afterClosed().subscribe(result => {
      if (dialogData.result !== null) {
        fromDate = dialogData.result.fromDate;
        toDate = dialogData.result.toDate;
        const sheetRows = [[], [], []];
        const sheetNames: string[] = ['Projects Overview', 'Projects Members', 'Projects Note'];
        const membersSheet: any[] = [];
        sheetRows.push(membersSheet);
        sheetNames.push('Members');
        const userActivities = {};
        const owners = {};
        let count = 0;
        let activities;
        let user;
        const length = this.users.length;
        for (let index = 0; index < length; index++) {
          userActivities[index.toString()] = [];
          user = this.users[index];
          let owner = user.payload.doc.id;
          owners[index.toString()] = user.payload.doc.data();
          if (owner) {
            count++;
            this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate)
            .then((response: any[]) => {
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
                for (let idx = 0; idx < length; idx++) {
                  activities = userActivities[idx.toString()];
                  owner = owners[idx.toString()];
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

  generateExcelDataForMissLogwork() {

  }

  exportMissLogworkAsExcelFile() {
    const momentDateFormat = localStorage.getItem('dateFormat').toUpperCase();
    /* Process from date and to date */
    const dateFormat = 'yyyy-MM-dd';
    const currentDate = this.datePipe.transform(new Date(), dateFormat).toString();
    let fromDate = moment.utc(currentDate, dateFormat.toUpperCase());
    while ((fromDate.weekday() + 7) % 7 !== this.startDay) {
      fromDate = fromDate.add(-1, 'd');
    }
    let toDate = moment.utc(currentDate, dateFormat.toUpperCase());
    /* dialogData */
    const dialogData: any = { title: this.translate.instant('user.choseDate'), fromDate, toDate,
      fromDateTitle: this.translate.instant('user.fromDate'), toDateTitle: this.translate.instant('user.toDate'),
      cancel: this.translate.instant('user.cancel'), ok: this.translate.instant('user.ok')
    };
    /* dialog open */
    const dialogRef = this.dialog.open(DialogDateRangeComponent, {
        data: dialogData
    });
    /* dialog subscribe */
    dialogRef.afterClosed().subscribe(result => {
      if (dialogData.result !== null) {
        fromDate = dialogData.result.fromDate;
        toDate = dialogData.result.toDate;
        const datePipe = this.datePipe;
        const excelData = [];
        let weekday;
        const workDates = [];
        const fromDate1 = moment(fromDate);
        const toDate1 = moment(toDate);
        while (fromDate1 <= toDate1) {
          weekday = fromDate1.weekday();
          if (weekday === 0 || weekday === 6) {
            fromDate1.add(1, 'd');
            continue;
          }
          workDates.push(moment(fromDate1));
          fromDate1.add(1, 'd');
        }
        let count = 0;
        this.users.forEach((user: any) => {
          const owner = user.payload.doc.id;
          const user1: any = user.payload.doc.data();
          if (owner) {
            count++;
            this.activityService.getByPropertyAndWorkDateRange('owner', owner, fromDate, toDate)
            .then((activities: any[]) => {
              count--;
              const workDates1 = [...workDates];
              activities.forEach((item: any) => {
                // Convert to moment date.
                let workDate: any = datePipe.transform(item.workDate, dateFormat).toString();
                workDate = moment.utc(workDate, dateFormat.toUpperCase());
                for (let i = 0; i < workDates1.length; i++) {
                  const element = workDates1[i];
                  if (element.isSame(workDate)) {
                    workDates1.splice(i, 1);
                    break;
                  }
                }
              });
              if (workDates1.length > 0) {
                // Push data to excelData.
                const data = {};
                data['User Name'] = user1.userName;
                data['Display Name'] = user1.surname + ' ' + user1.name;
                const missDates = [];
                workDates1.forEach((item1: any) => {
                  missDates.push(item1.format(momentDateFormat));
                });
                data['Miss dates'] = missDates.join(', ');
                excelData.push(data);
              }
              if (count === 0) {
                // Export to excel file.
                this.excelService.exportAsExcelFile(excelData, 'Miss', 'MissLogwork-' + fromDate.format('YYYYMMDD') + '-' + toDate.format('YYYYMMDD'));
              }
            }).catch(error => {
            });
          } else {
          }
        });
      }
    });
  }

}
