import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserCreateComponent } from '../components/user/user-create.component';
import { UserEditComponent } from '../components/user/user-edit.component';
import { UserEditResolver } from '../components/user/user-edit.resolver';
import { UserListComponent } from '../components/user/user-list.component';

const routers: Routes = [
    {
        path: '',
        component: UserListComponent
    },
    {
        path: 'create',
        component: UserCreateComponent
    },
    {
        path: 'edit/:id',
        component: UserEditComponent, resolve: { data : UserEditResolver }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routers)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule {
}
