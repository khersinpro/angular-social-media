import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, delay, mapTo, Observable, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ComplexFormValue } from "../models/complexe-form-value.model";


@Injectable()
export class ComplexeFormComponent {
  constructor( private http: HttpClient) {}

  saveUserInfo(formValue: ComplexFormValue): Observable<boolean> {
    return this.http.post(`${environment.apiUrl}/users`, formValue).pipe(
      mapTo(true),
      delay(1000),
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    )
  }
}
