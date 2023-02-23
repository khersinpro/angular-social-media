import { animate, animation, style } from "@angular/animations"


export const slidAndFadeAnimation = animation([
  // Style de base
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
    'background-color': 'rgb(201, 157, 242)',
  }),
  // animation et style voulu aprés l'ajout au dom du commentaire
  animate('250ms ease-out', style({
    transform: 'translateX(0%)',
    opacity: 1,
    'background-color': 'white',
  }))
])

