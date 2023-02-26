import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Candidate } from "../models/candidate.model";

@Injectable()
export class CandidatesService {
  constructor(private http: HttpClient) {}

  // Stock la date du dernier chargement de candidats
  private lastCandidateLoad = 0;

  // BehaviorSubjects qui sont exposés comme des Observables simples (empêchant des components d'appeler leur méthode  next )
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  // BehaviorSubjects qui sont exposés comme des Observables simples (empêchant des components d'appeler leur méthode  next )
  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  // Méthode qui sera appelée pour afficher ou non le loader
  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  // Récupération de la list des candidats, implémentation du loader et setting du behavior subject _candidates$
  getCandidateFromServer(): void {
    // Empeche un nouveau rafraichissement de la liste des candidats avant 5 minutes (30 000ms)
    if(Date.now() - this.lastCandidateLoad <= 30000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Candidate[]>(`${environment.apiUrl}/candidates`).pipe(
      delay(1000),
      tap(candidates => {
        this._candidates$.next(candidates);
        this.lastCandidateLoad = Date.now();
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  // Récupére un candidat par son ID dans la liste des candidats
  getCandidateByid(id: number): Observable<Candidate> {
    !this.lastCandidateLoad && this.getCandidateFromServer();
    return this.candidates$.pipe(
      map(candidates => candidates.filter(candidate => candidate.id === id)[0])
    );
  }

  refuseCandidate(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/candidates/${id}`).pipe(
      delay(1000),
      switchMap(() => this.candidates$),
      take(1),
      map(candidates => candidates.filter(candidate => candidate.id !== id)),
      tap(candidates => {
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  hireCandidate(id: number): void {
    this.candidates$.pipe(
      take(1),
      map(candidates => candidates
          .map(candidate => candidate.id === id ?
              { ...candidate, company: 'Snapface Ltd' } :
              candidate
          )
      ),
      tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
      switchMap(updatedCandidates =>
          this.http.patch(`${environment.apiUrl}/candidates/${id}`,
          updatedCandidates.find(candidate => candidate.id === id))
      )
    ).subscribe();
  }
}
