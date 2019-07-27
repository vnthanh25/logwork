import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActivityListComponent } from '../components/activity/activity-list.component';
import { ActivityCreateComponent } from '../components/activity/activity-create.component';
import { ActivityEditComponent } from '../components/activity/activity-edit.component';
import { ActivityEditResolver } from '../components/activity/activity-edit.resolver';

const routers: Routes = [
    { path: '', component: ActivityListComponent },
    { path: 'create', component: ActivityCreateComponent },
    { path: 'edit/:id/:isCreate', component: ActivityEditComponent, resolve: { data: ActivityEditResolver } }
];

@NgModule({
    imports: [
        RouterModule.forChild(routers)
    ],
    exports: [
        RouterModule
    ]
})
export class ActivityRoutingModule {
}
