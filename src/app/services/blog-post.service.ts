import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { BlogPost } from '../models/blogpost.model';
import { environment } from '../environments/environment.dev';
import { EndpointBase } from './endpoint-base.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService extends EndpointBase {
  private http = inject(HttpClient);

  //   getBlogPosts(): Observable<BlogPost[]> {
  //     return this.http
  //       .get<ListSupplierCategoryResponse>(
  //         `${environment.apiUrl}/api/v1/suppliers/categories`,
  //         this.requestHeaders
  //       )
  //       .pipe(
  //         catchError((error: HttpErrorResponse) => {
  //           return this.handleError(error, () => this.getBlogPosts());
  //         })
  //       );
  //   }

  createBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    return this.http
      .post<BlogPost>(`${environment.apiUrl}/api/v1/blog-post`, {
        ...blogPost,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleError(error, () => this.createBlogPost(blogPost));
        })
      );
  }
}
