import { animate, animateChild, animation, group, query, stagger, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { flashAnimation } from '../../animations/flash.animation';
import { slidAndFadeAnimation } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    // Déclaration d'un animation sur la parent de listItem pour beneficier du stagger pour @listItem
    trigger('list', [
      transition(':enter', [
        query('@listItem', [
          stagger(50, [
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('listItem', [
      // Style par default
      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      // Style activé
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(201, 157, 242)',
        'z-index': 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
      // transition a l'ajout d'un commentaire ':enter' pour signaler que c'est un ajout au dom
      transition(':enter', [
        query('.comment-text, .comment-date', style({
          opacity: 0
        })),
        useAnimation(slidAndFadeAnimation),
        // Fade in pour les span, il faut mettre l'opacity a 0 en debut de transition
        // group permet de declencher des animation en même temps
        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'rgb(249, 179, 111)'
            }
          }),
          query('.comment-text', [
            animate('500ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('1000ms', style({
              opacity: 1
            }))
          ]),
        ])
      ])
    ])
  ]
})
export class CommentsComponent implements OnInit{

  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();

  commentCtrl!: FormControl;
  animationStates: { [key: number]: 'default' | 'active' } = {};

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);
    for (let index in this.comments) {
      this.animationStates[index] = 'default';
  }
  }

  // Quand un utilisateur ajoute un commentaire, cette fonction emet le commentaire grace
  // a son @Output vers post-list-item dans le but de créer le commentaire
  onLeaveComment(): void {
    if (this.commentCtrl.invalid) {
      return;
    }
    const maxId = Math.max(...this.comments.map(comment => comment.id));
    this.comments.unshift({
      id: maxId +1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    })
    this.commentCtrl.value
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

    onListItemMouseEnter(index: number) {
      this.animationStates[index] = 'active';
  }

  onListItemMouseLeave(index: number) {
      this.animationStates[index] = 'default';
  }
}
