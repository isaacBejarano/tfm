import { RedirectFunction, Route } from '@angular/router';
import { Home } from '@home/home';
// TODO: review after Arquitecture of Information
type SpaPaths =
  // public
  | '' // home c <login> c <signup> c logout() + (pass recovery?)
  | 'rgpd'
  | '**'
  // private (auth)
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
  {
    title,
    path: '',
    pathMatch: 'full',
    component: Home, // eager --> it has the <login> compo and some nice UX pictures like a Landing
    // canActivate: [isNotLoggedGuard]
  },
  {
    title: `${title} | RGPD`,
    path: 'rgpd', // FIXME: TS path alias
    // loadComponent: () => import('./rgpd/rgpd').then((m) => m.Rgpd), // lazy
    loadComponent: () => import('@rgpd/rgpd').then((m) => m.Rgpd), // lazy
  },
  // TODO: Rest of routes here...
  { path: '**', pathMatch: 'full', redirectTo: '' }, // 404 redirect
];
export { routes };

// TODO: locale 'ES'
