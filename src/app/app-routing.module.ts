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
  //{ path: 'user', loadChildren: () => import('./modules/user.module').then(mod => mod.UserModule) },
  //{ path: 'user', loadChildren: () => UserModule },
  //{ path: 'user', loadChildren: './modules/user.module#UserModule' },
  { path: 'user',
    children: [
      {
        path: '', loadChildren: './modules/user.module#UserModule'
      }
    ]
  },
  { path: 'activity', component: ActivityListComponent },
  { path: 'activity/create', component: ActivityCreateComponent },
  { path: 'activity/edit/:id/:isCreate', component: ActivityEditComponent, resolve: { data: ActivityEditResolver } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    //LocalizeRouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
