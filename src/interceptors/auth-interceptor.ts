import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('Interceptor Hit !')

  const token = sessionStorage.getItem('accessToken')

  if(!token){
    return next(req);
  }

  const authReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  })
  return next(authReq);
};
