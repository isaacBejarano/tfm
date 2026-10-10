import { RedirectFunction, Route } from '@angular/router';
import { Home } from './home/home';

// TODO: review after Arquitecture of Information
type SpaPaths =
  // public
  | '' // home c <login> + (pass recovery?)
  | 'signup'
  | 'rgpd'
  | 'logout'
  | '**'
  // private (auth)
  | 'veggie/edit'
  | 'user/:id/dashboard' // weatherforecast (add grafics if time) + town selector -> list of multiple "agendas" may exist for a single user (e.g. 2 houses)
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
    // path: ((): AppRouting => 'WSW')(),
    pathMatch: 'full',
    component: Home, // eager --> it has the <login> compo and some nice UX pictures like a Landing
    // canActivate: [isNotLoggedGuard]
  },
  {
    title: `${title} | Sign up`,
    path: 'signup',
    // loadComponent: () => import('@app/user/signup/signup').then((m) => m.Signup), // lazy
  },
  {
    title: `${title} | RGPD`,
    path: 'rgpd',
    loadComponent: () => import('./rgpd/rgpd').then((m) => m.Rgpd), // lazy
  },
  // TODO: Rest of routes here...
  {
    title: `${title} | Log out`,
    path: 'logout',
    redirectTo: (): SpaPaths => {
      // inject(UserStore).clearToken(); // TODO: save access JWT in RAM (not localStorage!) to avoid XSS attack
      return '';
    },
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }, // 404 redirect
];

export { routes };
