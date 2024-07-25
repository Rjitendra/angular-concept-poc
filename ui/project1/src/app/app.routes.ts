import { Routes } from '@angular/router';
import { ClAboutComponent } from './modules/components/cl-about/cl-about.component';
import { ClContactComponent } from './modules/components/cl-contact/cl-contact.component';
import { ClExpressBuilderComponent } from './modules/components/cl-express-builder/cl-express-builder.component';
import { ClHomeComponent } from './modules/components/cl-home/cl-home.component';
import { ClLayoutComponent } from './cl-layout/cl-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: ClLayoutComponent,
        children: [
          { path: '', component: ClHomeComponent },
          { path: 'about', component: ClAboutComponent },
          { path: 'contact', component: ClContactComponent },
          { path: 'express-builder', component: ClExpressBuilderComponent },
        //   {
        //     path: 'customer',
        //     loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
        //   }
        ]
      }
];
