import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GstAddComponent } from './gst-add/gst-add.component';
import { GstEditComponent } from './gst-edit/gst-edit.component';
import { GstGetComponent } from './gst-get/gst-get.component';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { ActivityListComponent } from './components/activity/activity-list.component';
import { ActivityCreateComponent } from './components/activity/activity-create.component';
import { ActivityEditComponent } from './components/activity/activity-edit.component';
import { ActivityEditResolver } from './components/activity/activity-edit.resolver';

const routes: Routes = [
  { path: 'business/create', component: GstAddComponent },
  { path: 'business/edit/:id', component: GstEditComponent },
  { path: 'business', component: GstGetComponent },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user', component: HomeComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'details/:id', component: EditUserComponent, resolve: { data : EditUserResolver } },
  { path: 'activity', component: ActivityListComponent },
  { path: 'activity/create', component: ActivityCreateComponent },
  { path: 'activity/edit/:id', component: ActivityEditComponent, resolve: { data: ActivityEditResolver } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
