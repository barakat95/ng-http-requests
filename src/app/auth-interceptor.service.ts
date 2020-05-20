import { HttpInterceptor, HttpEventType } from "@angular/common/http";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: import("@angular/common/http").HttpRequest<any>,
    next: import("@angular/common/http").HttpHandler
  ): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
    const modifiedRequest = req.clone({
      headers: req.headers.append("new-header", "xyz")
    });
    console.log("Request is on the way");
    return next.handle(modifiedRequest);
    //     .pipe(
    //     tap(event => {
    //       console.log(event);
    //       if (event.type === HttpEventType.Response) {
    //         console.log("Response Arrived, body data : ");
    //         console.log(event.body);
    //       }
    //     })
    //   );
  }
}
