import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorUserInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('ajps_access_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
