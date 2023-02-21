import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";

@Injectable()
export class PostService {
  constructor(private http: HttpClient) {}

  // Recupération d'une liste de post
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }

  // Création d'un commentaire
  addNewComment(postCommented: { comment: string, postId: number }) {
    console.log(postCommented);;
  }
}
