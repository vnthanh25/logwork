import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
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
    RouterModule.forRoot(routes, { useHash: true, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
