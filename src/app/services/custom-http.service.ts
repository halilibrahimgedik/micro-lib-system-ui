import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class CustomHttpService {
  private url = "http://localhost:18080/";
  private httpClient = inject(HttpClient);

  post<T>(action: string, data: Record<string, any> | null = null): Observable<ApiResponse<T>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      action: action
    });

    return this.httpClient.post<ApiResponse<T>>(this.url, data, {headers: headers})
  }
}
