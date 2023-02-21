import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

// Déclaration de la directive ainsi que le selecteur a utilisé dans le dom
@Directive({
  selector: '[highlight]'
})
// impléments l'interface AfterViewInit permet d'initialisé la directive aprés que le dom soit chargé
export class HightLightDirective implements AfterViewInit{

  // Permet de passer des couleur dans l'element html
  // Ex => <p highlight color='blue'> text bidon </p>
  @Input() color = 'yellow';

  // le constucteur recupére l'element ou la directive a été appliqué
  // ainsi que le Renderer2 qui permet d'appliqué les styles a l'élement
  constructor(private element: ElementRef, private renderer: Renderer2) {}

  // Une fois que le dom est chargé, on lance la fonction de coloration des éléments
  // qui son affecté par la directive hightlight
  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }

  // Fonction qui applique une couleur a l'element qui a la directive highlight appliqué
  setBackgroundColor(color: string) {
    this.renderer.setStyle(this.element.nativeElement, 'background-color', color);
  }

  // Cette fonction ecoute un evenement sur l'element html qui a déclaré la directive
  // Change la coleur de l'element a l'entrée de la souris
  @HostListener('mouseenter') onMouseEnter() {
    this.setBackgroundColor('lightgreen');
  }

  // Change la coleur de l'element a la sourtis de la souris
  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor(this.color);
  }

  // Change le this.color au clic sur l'élément
  @HostListener('click') onMouseClick() {
    this.color = 'lightgreen';
  }
}
