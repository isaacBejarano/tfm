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
  | 'veggie/edit'
  | 'user/:id/dashboard' // weatherforecast (add grafics if time) + town selector -> list of multiple 'agendas' may exist for a single user (e.g. 2 houses)
  | 'user/:id/edit' // self profile edit
  | 'user/:id/agenda' // self veggie agenda - weekly (and monthly?)
  | 'admin/:id/edit/user/:id' // admins cannot modify agendas or dashboards, only users profile
  | 'admin/:id/list/user'; // admins cannot modify agendas or dashboards, only users profile
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
  // PRIVATE -> TODO: add route first fragment to 'robots.txt' to prevent SEO crowling on them
  //...
  // LAST!
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '', // wildcard to Home
  },
];
export { routes };
