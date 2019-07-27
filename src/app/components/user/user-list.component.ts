import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router, Params } from '@angular/router';
import { UserService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
//import { I18nProvider } from 'src/app/providers/I18nProvider';
import { lang } from 'moment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  searchValue = '';
  items: Array<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    public authService: AuthService,
    //private i18nProvider: I18nProvider,
    private translate: TranslateService
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
    localStorage.setItem('idUser', item.payload.doc.id);
    this.router.navigate(['/activity']);
  }

  searchByUserName() {
    const value = this.searchValue.toLowerCase();
    this.userService.searchByUserName(value)
    .subscribe(result => {
      this.items = result;
    });
  }

}
