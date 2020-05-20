import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from "@angular/common/http";
import { Post } from "./post.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request
    this.http
      .post<{
        name: string;
      }>("https://angular-http-9eb5f.firebaseio.com/posts.json", postData)
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let params = new HttpParams();
    params = params.append("print", "pretty");
    params = params.append("custom-header", "hello");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://angular-http-9eb5f.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ "custom-header": "Hello" }),
          params: params,
          responseType: "json"
        }
      )
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete("https://angular-http-9eb5f.firebaseio.com/posts.json", {
        observe: "events",
        responseType: "text"
      })
      .pipe(
        tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
          if (event.type === HttpEventType.Sent) {
            console.log(event.type);
          }
        })
      );
  }
}
