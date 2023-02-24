import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-complexe-form',
  templateUrl: './complexe-form.component.html',
  styleUrls: ['./complexe-form.component.scss']
})
export class ComplexeFormComponent {
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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initFormControl();
    this.initMainForm();
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm,
    });
  }


  onSubmitForm() {
    console.log(this.mainForm.value);

  }

  private initFormControl() {
    // Création des differentes briques de formulaire a ajouter au mainForm
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
    });

    // Création de control séparé pour les mots de passe et création du formgroup pour les infos user
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    })
  }
}
