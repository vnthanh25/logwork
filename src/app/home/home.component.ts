import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Router, Params } from '@angular/router';
import { UserService } from '../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    // Set localStorage: currentEntity.
    localStorage.setItem('currentEntity', 'user');
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    //this.firebaseService.getDocuments('users')
    this.userService.getAll()
    .subscribe(result => {
      this.items = result;
      this.age_filtered_items = result;
      this.name_filtered_items = result;
    });
  }

  viewDetails(item){
    this.router.navigate(['/details/'+ item.payload.doc.id]);
  }

  listActivities(item) {
    localStorage.setItem('idUser', item.payload.doc.id);
    this.router.navigate(['/activity']);
  }

  searchByUserName() {
    const value = this.searchValue.toLowerCase();
    //this.firebaseService.searchDocumentsByStartProperty('users', 'userName', value)
    this.userService.searchByUserName(value)
    .subscribe(result => {
      this.name_filtered_items = result;
      this.items = this.combineLists(result, this.age_filtered_items);
    });
  }

  capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  combineLists(a, b) {
    let result = [];

    a.filter(x => {
      return b.filter(x2 => {
        if (x2.payload.doc.id == x.payload.doc.id) {
          result.push(x2);
        }
      });
    });
    return result;
  }

}
