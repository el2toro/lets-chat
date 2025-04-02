import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('logged in')
      return true; // Allow access
    } else {
      this.router.navigate(['/login']); // Redirect if not authenticated
      console.log('not logged in')
      return false;
    }
  }
}