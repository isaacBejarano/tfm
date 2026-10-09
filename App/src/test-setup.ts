import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
/* NOTE:
  "using vitest directly is not supported, please use the Angular CLI to run the tests"
  https://github.com/angular/angular-cli/issues/32055

  + Vitest Plugin not working on Angular --> just run ng test
*/
