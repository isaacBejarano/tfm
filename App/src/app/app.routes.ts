import { RedirectFunction, Route } from '@angular/router';
import { Home } from '@home/home';

// TODO: review after Arquitecture of Information
type SpaPaths =
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
type SpaRote = Omit<Route, 'path'> & {
  path: SpaPaths;
  redirectTo?: SpaPaths | RedirectFunction;
};
type SpaRoutes = SpaRote[];
const title = 'Kübello';
const routes: SpaRoutes = [
  // PUBLIC -> TODO: allow SEO crowling by adding ActivatedRoute data custom flag "isCanonical" (app.ts)
  {
    title,
    path: '',
    pathMatch: 'full',
    component: Home, // eager --> it has the <login> and <signup> compo [+ logout() + pass recovery?]
    data: { isCanonical: true }, // only public routes!
    // canActivate: [isNotLoggedGuard]
  },
  {
    title: `${title} | RGPD`,
    path: 'rgpd',
    loadComponent: () => import('@rgpd/rgpd').then((m) => m.Rgpd), // lazy
    data: { isCanonical: true }, // only public routes!
  },
  {
    title: `${title} | Cokies`,
    path: 'cookies',
    loadComponent: () => import('@cookies/cookies').then((m) => m.Cookies), // lazy
    data: { isCanonical: true }, // only public routes!
  },
  //...
  // PRIVATE -> TODO: add route first fragment to 'robots.txt' to prevent SEO crowling .e.g. /user/, /admin/ (no child routes)
  {
    title: `${title}`,
    path: 'agendas/:id',
    loadComponent: () => import('@agenda/agenda').then((m) => m.Agenda), // lazy
    // TODO: AUTH guard
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
