import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);

  if(usersService.isLogged()){
    return router.navigate(['/home']);
  }
  else{
    return true;
  }
};
