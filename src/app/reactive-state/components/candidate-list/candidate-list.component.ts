import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { CandidateSearchType } from '../../enums/candidate-search-type.enum';
import { Candidate } from '../../models/candidate.model';
import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit{

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: CandidateSearchType,
    label: string
  }[];

  constructor(private candidatesService: CandidatesService, private router: Router, private formBuilder: FormBuilder) {};

  ngOnInit() :void {
    this.candidatesService.getCandidateFromServer();
    this.initForm();
    this.initObservables();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(CandidateSearchType.COMPANY);
    this.searchTypeOptions = [
      { value: CandidateSearchType.FIRSTNAME, label: 'Prénom'},
      { value: CandidateSearchType.LASTNAME, label: 'Nom'},
      { value: CandidateSearchType.COMPANY, label: 'Entreprise'},
    ];
  }

  private initObservables(): void {
    this.loading$ = this.candidatesService.loading$;
    // Création d'un observable a partir de la recherche du formulaire pour recupérer la recherche
    const search$ = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(value => value.toLowerCase())
    );
    // Création d'un observable a partir de la recherche du formulaire pour recupérer le type de recherche
  const searchType$: Observable<CandidateSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
  );
  // Recupération des candidats avec les observable ci dessus comme filtre
  // la fonction combineLastest permet de combiner plusieurs observables
  this.candidates$ = combineLatest([
    search$,
    searchType$,
    this.candidatesService.candidates$
    ]
    ).pipe(
        map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
            .toLowerCase()
            .includes(search))
        )
    );
  }

}
