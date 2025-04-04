import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` } // ✅ Attach token
    });
  }

  return next(req);
}
