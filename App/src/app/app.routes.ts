import { RedirectFunction, Route } from '@angular/router';

import { authAdminAndSuper } from '@app/auth/authorized-admin-or-super.guard';
import { authUser } from '@app/auth/authorized-user.guard';
import { authenticated } from '@auth/authenticated.guard';
import { Home } from '@home/home';

// TODO: review after Arquitecture of Information
type AppPathFragments = '' | 'rgpd' | 'cookies' | 'users' | 'agendas';
type AppPaths =
  // PUBLIC
  | '' // home
  | 'rgpd'
  | 'cookies'
  | 'copyright'
  | '**'
  // PRIVATE
  | 'users' // list all users <- of [roles: User] when 'Admin'; of [roles: User, Admin] when 'Super'
  | 'users/:id' // CRUD by role of logged user upon profile
  | 'agendas/new' // create user weekly agenda <- only [roles: User] when 'User'; 'Admin' & 'Super' have no agendas.
  | 'agendas/:id'; // CRUD by role 'User'
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
  {
    title: `${title} | Copyright`,
    path: 'copyright',
    loadComponent: () => import('@copyright/copyright').then((m) => m.Copyright), // lazy
    data: { isCanonical: true }, // only public routes!
  },
  //...
  // PRIVATE -> TODO: add route first fragment to 'robots.txt' to prevent SEO crowling .e.g. /user/, /admin/ (no child routes)
  {
    title: `${title} | Lista de Usuarios`,
    path: 'users',
    loadComponent: () => import('@user/user-list').then((m) => m.UserList), // lazy
    canActivate: [authenticated, authAdminAndSuper],
  },
  {
    title: `${title} | Perfil de Usuario`,
    path: 'users/:id',
    loadComponent: () => import('@profile/profile').then((m) => m.Profile), // lazy
    canActivate: [authenticated],
  },
  {
    title: `${title} | Nueva Agenda de Usuario`,
    path: 'agendas/new',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    canActivate: [authenticated, authUser],
  },
  {
    title: `${title} | Agenda de Usuario`,
    path: 'agendas/:id',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    canActivate: [authenticated, authUser],
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
