import { Routes } from '@angular/router';
import { Login } from '../auth/login/login';
import { Register } from '../auth/register/register';
import { Layout } from '../layout/layout';
import { ForgotPassword } from '../auth/forgot-password/forgot-password';
import { ResetPassword } from '../auth/reset-password/reset-password';
import { authGuard } from '../guard/auth-guard';


export const routes: Routes = [
  {path:'',component:Register,pathMatch:'full'},
  {path:'register',component:Register},
  {path:'login',component:Login},
  {path:'forgot-password',component:ForgotPassword},
  {path:'reset-password',component:ResetPassword},
  {path:'admin',component:Layout, canActivateChild: [authGuard],
    children:[
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        
      },
      {
        path:'dashboard',
        loadComponent:()=>import('../layout/dashboard/dashboard').then(m=>m.Dashboard)
      },
      {
        path:'user-management',loadComponent:()=>import('../layout/users/users').then(m=>m.Users)
      },
       {
        path:'roles-management',loadComponent:()=>import('../layout/roles/roles').then(m=>m.Roles)
      },
       {
        path:'permission-management',loadComponent:()=>import('../layout/permission/permission').then(m=>m.Permission)
      }
    ]
  
  },
  {path:'**',redirectTo:'login'}

];
