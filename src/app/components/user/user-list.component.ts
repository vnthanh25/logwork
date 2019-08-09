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

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  searchValue = '';
  datePipe = new DatePipe('en-US');
  items: Array<any>;

  constructor(
    private router: Router,
    public authService: AuthService,
    //private i18nProvider: I18nProvider,
    private translate: TranslateService,
    private userService: UserService,
    private excelService: ExcelService,
    private activityService: ActivityService
  ) {
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.userService.getAll()
    .subscribe(result => {
      this.items = result;
    });
  }

  viewDetails(item){
    this.router.navigate(['/user/edit/' + item.payload.doc.id]);
  }

  listActivities(item) {
    localStorage.setItem('idUserSelected', item.payload.doc.id);
    localStorage.setItem('userSelected', JSON.stringify(item.payload.doc.data()));
    this.router.navigate(['/activity']);
  }

  searchByUserName() {
    const value = this.searchValue.toLowerCase();
    this.userService.searchByUserName(value)
    .subscribe(result => {
      this.items = result;
    });
  }

  generateExcelDate(activities: any) {
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
    for (let index = length - 1; index > -1; index--) {
        const item = activities[index];
        reporter = this.userService.users[item.owner].name;
        estimate = 1;
        remaining = 0;
        if (item.status.toLowerCase() === 'In Progress'.toLowerCase()) {
            estimate += 1;
            remaining += 1;
        }
        worked = estimate - remaining;
        workdate = this.datePipe.transform(item.workDate, localStorage.getItem('dateFormat'));
        const worklogDay = 'Coding;' + workdate + ';' + this.userService.users[item.owner].account + ';' + (worked);
        const worklog = 'Coding;' + workdate + ';' + this.userService.users[item.owner].account + ';' + (worked * daySeconds);
        const data = {};
        data['Project Name'] = item.projectName;
        data['Project key'] = null;
        data['Summary'] = item.code.charAt(0).toUpperCase() + item.code.slice(1);
        data['Issue Type'] = item.type;
        data['Reporter'] = item.reportTo;
        data['Assignee'] = this.userService.users[item.owner].account;
        data['Start Date'] = workdate;
        data['Due Date'] = workdate;
        data['Original Estimate (day)'] = estimate;
        data['Worked (day)'] = worked;
        data['Remaining (day)'] = remaining;
        data['Status (day)'] = item.status;
        data['Worklog (comment;date_for_logwork;account;second) (day)'] = worklogDay;
        data['Original Estimate'] = estimate * daySeconds;
        data['Remaining'] = remaining * daySeconds;
        data['Status'] = item.status;
        data['Worklog (comment;date_for_logwork;account;second)'] = worklog;
        // push.
        excelData.push(data);
    }
    // return.
    return excelData;
  }

  exportDailyAsExcelFile(): void {
    const sheetRows = [];
    const sheetNames: string[] = [];
    this.items.forEach((item: any) => {
      const owner = item.payload.doc.data().id;
      const sheetName: string = item.payload.doc.data().userName.replace('@fsoft.com.vn', '').toUpperCase();
      sheetNames.push(sheetName);
      if (owner) {
        this.activityService.getByProperty('owner', owner).then((response:any[]) => {
          sheetRows.push(this.generateExcelDate(response));
          if (sheetRows.length === this.items.length) {
            this.excelService.exportDailyAsExcelFile(sheetRows, sheetNames, 'Work logs(2Teams)');
          }
        }).catch(error => {
        });
      } else {
        sheetRows.push([]);
      }
    });
  }

  exportWeeklyAsExcel(): void {
    const sheetRows = [];
    const sheetNames: string[] = [];
    this.items.forEach((item: any) => {
      const owner = item.payload.doc.data().id;
      const sheetName: string = item.payload.doc.data().userName.replace('@fsoft.com.vn', '').toUpperCase();
      sheetNames.push(sheetName);
      if (owner) {
        this.activityService.getByProperty('owner', owner).then((response:any[]) => {
          sheetRows.push(this.generateExcelDate(response));
          if (sheetRows.length === this.items.length) {
            this.excelService.exportDailyAsExcelFile(sheetRows, sheetNames, 'Work logs(2Teams)');
          }
        }).catch(error => {
        });
      } else {
        sheetRows.push([]);
      }
    });
  }

}
