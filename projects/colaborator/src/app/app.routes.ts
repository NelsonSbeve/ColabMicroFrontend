import { Routes } from '@angular/router';

export const routes: Routes = [
      {
        path: '',
        loadChildren: () => import('../../colaborator-main/colaborator-main.module').then((m) => m.ColaboratorMainModule)
      }
];
