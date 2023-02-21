import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostResolver } from './resolvers/posts.resolver';

const routes: Routes = [
  // Récupération de la list des posts grace au resolver avant d'afficher postListComponent
  { path: '', component: PostListComponent, resolve: { posts: PostResolver}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule {}
