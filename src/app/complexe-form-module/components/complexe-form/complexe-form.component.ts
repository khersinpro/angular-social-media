import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { ComplexeFormService } from '../../services/complexe-form.service';
import { confirmEqualValidator } from '../../validators/confirm-equals.validator';

@Component({
  selector: 'app-complexe-form',
  templateUrl: './complexe-form.component.html',
  styleUrls: ['./complexe-form.component.scss']
})
export class ComplexeFormComponent {

  loading = false;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  phoneCtrl!: FormControl;
  emailCtrl!: FormControl;
  emailForm!: FormGroup;
  confirmEmailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  constructor(private formBuilder: FormBuilder, private complexFormService: ComplexeFormService) {}

  ngOnInit(): void {
    this.initFormControl();
    this.initMainForm();
    this.initFormObservable();
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      phone: this.phoneCtrl,
      email: this.emailForm,
      loginInfo: this.loginInfoForm,
    });
  }


  // Création des differentes briques de formulaire a ajouter au mainForm
  private initFormControl() {
    // Formulaire d'infos perso
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    // Control du choix de formulaire de contact email <=> phone
    this.contactPreferenceCtrl = this.formBuilder.control('email');

    this.phoneCtrl = this.formBuilder.control('');

    // Création des controls pour l'email puis création de formGroup
    this.emailCtrl = this.formBuilder.control('');
    this.confirmEmailCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl
    }, {
      validators: [confirmEqualValidator('email', 'confirm')],
      updateOn: 'blur'
    });

    // Création de control séparé pour les mots de passe et création du formgroup pour les infos user
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    })
  }

  // Initialise la visibilité des champs email/phone du formulaire
  // et permet leurs mise a jour dans le dom selon la section de l'utilisateur
  // Les fonctions appelé dans les tap permettent de mettre a jour mes validator de phone/email
  private initFormObservable() {
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      // Permet de démarer avec la valeur du contactPreference control
      // car le valueChanges n'est pas pris en compte au chargement de page
      startWith(this.contactPreferenceCtrl.value),
      map(value => value === 'phone'),
      tap(showPhoneCtrl => this.setPhoneValidators(showPhoneCtrl))
    );

    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map(value => value === 'email'),
      tap(showEmailCtrl => this.setEmailValidators(showEmailCtrl))
    );

    this.showEmailError$ =  this.emailForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
      this.emailCtrl.value &&
      this.confirmEmailCtrl.value
      )
    )
    
    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(status => status === 'INVALID' &&
                    this.passwordCtrl.value &&
                    this.confirmPasswordCtrl.value
      )
    );
  }

  // Fonction qui permet de modifier les validators du Ctrl concerné selon le choix de l'utilisateur (email/phone)
  setEmailValidators(showEmailCtrl: boolean) {
    // Ajoute les validator au emailCtrl car il est sélectionné
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
      this.confirmEmailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
    // Retire les validator du emailCtrl car il est déselectionné
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
    }
    // Sauvegarde les changement apporter aux validator de phoneCtrl
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  // Fonction qui permet de modifier les validators du Ctrl concerné selon le choix de l'utilisateur (email/phone)
  setPhoneValidators(showPhoneCtrl: boolean) {
    // Ajoute les validator au phoneCtrl car il est sélectionné
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ])
    // Retire les validator du phoneCtrl car il est déselectionné
    } else {
      this.phoneCtrl.clearValidators();
    }
    // Sauvegarde les changement apporter aux validator de phoneCtrl
    this.phoneCtrl.updateValueAndValidity();
  }

  // Methode qui permet d'afficher les erreur de formulaire dans le dom
  // AbstractControl peu prendre les formGroup et formControl en param
  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
        return 'Merci d\'entrer une adresse mail valide';
    } else if (ctrl.hasError('minlength')) {
        return 'Ce numéro de téléphone ne contient pas assez de chiffres';
    } else if (ctrl.hasError('maxlength')) {
        return 'Ce numéro de téléphone contient trop de chiffres';
    } else {
        return 'Ce champ contient une erreur';
    }
  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
        tap(saved => {
            this.loading = false;
            if (saved) {
              this.mainForm.reset();
              this.contactPreferenceCtrl.patchValue('email');
              } else {
              console.error('Echec de l\'enregistrement');
          }
        })
    ).subscribe();
}
}
