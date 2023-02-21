import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {

  @Input() post!: Post;
  @Output() postCommented = new EventEmitter<{comment: string, postId: number}>();

  tempUser = { firstName: 'prénom', lastName: 'Nomdefamille'};

  constructor() {}

  ngOnInit(): void {

  }

  // Fonction qui ecoute l'@Ouput du comments.component et qui recois le message du commentaire
  // Fait passé ensuite le commentaire et le postId post-list pour créer le commentaire avec le service postService
  onNewComment(comment: string) {
    this.postCommented.emit({ comment, postId: this.post.id });
  }
}
