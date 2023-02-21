import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit{

  posts$!: Observable<Post[]>;

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit(): void {
    // Récupération des posts depuis les data de la route active
    this.posts$ = this.route.data.pipe(
      map(data => data['posts'])
    );
  }

  // Fonction qui écoute l'@Output de post-list-item et qui recois le commentaire pour le créer
  onPostCommented(postCommented: { comment: string, postId: number}) {
    this.postService.addNewComment(postCommented);
  }
}
