import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Column} from './models/columns';
import {Users} from './models/users';
import {Actions} from './models/actions';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url = 'http://localhost:8127/';
  constructor(private http: HttpClient) { }

  getColumnsTable( part: string ): Observable<Column[]> {
        return this.http.get<Column[]>(this.url + 'metadata?table=' + part);
    }
  getDataUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.url + '/data?table=users');
  }
  getDataActions(): Observable<Actions[]> {
    return this.http.get<Actions[]>(this.url + '/data?table=actions');
  }

  getColumnsUser(): Observable<Column[]> {
    return this.http.get<Column[]>(this.url + 'metadata?table=users');
  }
  getColumnsActions(): Observable<Column[]> {
    return this.http.get<Column[]>(this.url + 'metadata?table=actions');
  }

  }

