import { RedirectFunction, Route } from '@angular/router';

import { authorizedAdminOrSuperGuard } from '@app/auth/authorized-admin-or-super.guard';
import { authorizedUserGuard } from '@app/auth/authorized-user.guard';
import { authenticatedGuard } from '@auth/authenticated.guard';
import { Home } from '@home/home';

// TODO: review after Arquitecture of Information
type AppPathFragments = '' | 'rgpd' | 'cookies' | 'users' | 'agendas';
type AppPaths =
  // PUBLIC
  | '' // home
  | 'rgpd'
  | 'cookies'
  | '**'
  // PRIVATE
  | 'users' // list all users <- of [roles: User] when 'Admin'; of [roles: User, Admin] when 'Super'
  | 'users/:id' // user profile details (show profile, selected zone, veggies to plant) <- [ID: Self] when 'User'; [ID: User, Self] when 'Admin'; [ID: User, Admin, Self] when 'Super'
  | 'users/:id/edit' // user profile edit (only profile, no zones, no veggies) <- [ID: Self] when 'User'; [ID: User, Self] when 'Admin'; [ID: User, Admin, Self] when 'Super'
  | 'agendas/new' // create user weekly agenda <- only [roles: User] when 'User'; 'Admin' & 'Super' have no agendas.
  | 'agendas/:id' // read user weekly agenda <- only [roles: User] when 'User'; 'Admin' & 'Super' have no agendas.
  | 'agendas/:id/edit'; // edit user weekly agenda <- only to add or remove veggies, not zones <- [roles: User] when 'User'; 'Admin' & 'Super' have no agendas.
type AppRote = Omit<Route, 'path'> & {
  path: AppPaths;
  redirectTo?: AppPaths | RedirectFunction;
};
type AppRotes = AppRote[];
const title = 'Kübello';
const routes: AppRotes = [
  // PUBLIC -> TODO: allow SEO crowling by adding ActivatedRoute data custom flag "isCanonical" (app.ts)
  {
    title,
    path: '',
    pathMatch: 'full',
    component: Home, // eager --> it has the <login> and <signup> compo [+ logout() + pass recovery?]
    data: { isCanonical: true }, // only public routes!
  },
  {
    title: `${title} | RGPD`,
    path: 'rgpd',
    loadComponent: () => import('@rgpd/rgpd').then((m) => m.Rgpd), // lazy
    data: { isCanonical: true }, // only public routes!
  },
  {
    title: `${title} | Cookies`,
    path: 'cookies',
    loadComponent: () => import('@cookies/cookies').then((m) => m.Cookies), // lazy
    data: { isCanonical: true }, // only public routes!
  },
  //...
  // PRIVATE -> TODO: add route first fragment to 'robots.txt' to prevent SEO crowling .e.g. /user/, /admin/ (no child routes)
  {
    title: `${title} | Lista de Usuarios`,
    path: 'users',
    loadComponent: () => import('@user/user-list').then((m) => m.UserList), // lazy
    canActivate: [authenticatedGuard, authorizedAdminOrSuperGuard],
  },
  {
    title: `${title} | Perfil de Usuario`,
    path: 'users/:id',
    loadComponent: () => import('@profile/profile').then((m) => m.Profile), // lazy
    canActivate: [authenticatedGuard],
  },
  {
    title: `${title} | Edición de Perfil de Usuario`,
    path: 'users/:id/edit',
    loadComponent: () => import('@profile/profile').then((m) => m.Profile), // lazy
    canActivate: [authenticatedGuard],
  },
  {
    title: `${title} | Nueva Agenda de Usuario`,
    path: 'agendas/new',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    canActivate: [authenticatedGuard, authorizedUserGuard],
  },
  {
    title: `${title} | Agenda de Usuario`,
    path: 'agendas/:id',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    canActivate: [authenticatedGuard, authorizedUserGuard],
  },
  {
    title: `${title} | Edición de Agenda de Usuario`,
    path: 'agendas/:id/edit',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    canActivate: [authenticatedGuard, authorizedUserGuard],
  },
  //...
  // LAST!
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '', // wildcard to Home
  },
];
export { routes };
export type { AppPathFragments };
