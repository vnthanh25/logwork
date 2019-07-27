import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
// import { UserCreateComponent } from './components/user/user-create.component';
// import { UserEditComponent } from './components/user/user-edit.component';
// import { UserEditResolver } from './components/user/user-edit.resolver';
// import { UserListComponent } from './components/user/user-list.component';
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityCreateComponent } from './components/activity/activity-create.component';
import { ActivityEditComponent } from './components/activity/activity-edit.component';
import { ActivityEditResolver } from './components/activity/activity-edit.resolver';
import { UserModule } from './modules/user.module';

//import {LocalizeRouterModule} from 'localize-router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'user', children: [{
        path: '', loadChildren: './modules/user.module#UserModule'
    }]
  },
  { path: 'activity', children: [{
        path: '', loadChildren: './modules/activity.module#ActivityModule'
    }]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    //LocalizeRouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
