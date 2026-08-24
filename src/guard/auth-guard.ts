import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);

 const token = sessionStorage.getItem('accessToken');
console.log('Guard running:', token);
  if (token && token !== 'undefined' && token !== 'null') {
    return true;
  }

  return router.createUrlTree(['/login']);
};
