import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(private http: HttpClient) {}

  public evaluateOperation(
    first_op: string,
    operator: string,
    second_op: string
  ): Observable<string> {
    return this.http.post<string>(
      `http://localhost:9097/operation/${first_op}/${operator}/${second_op}`,
      JSON
    );
  }

  public handles_unary(operator: string, operand: string): Observable<string> {
    return this.http.post<string>(
      `http://localhost:9097/operation/${operator}/${operand}`,
      JSON
    );
  }
}
