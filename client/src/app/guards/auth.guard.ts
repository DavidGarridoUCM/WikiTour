import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  if(usersService.isLogged()){
    return true;
  }
  else{
    return router.navigate(['/login']);
  }
};
