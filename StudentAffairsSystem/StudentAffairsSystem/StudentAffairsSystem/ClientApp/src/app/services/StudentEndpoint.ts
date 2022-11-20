import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from './endpoint-base.service';
import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';
import { StudentFormViewModel } from '../models/StudentFormViewModel';




@Injectable()
export class StudentEndpoint extends EndpointBase {

  constructor(private configurations: ConfigurationService, http: HttpClient, authService: AuthService) {
    super(http, authService);
  }
  get studentListUrl() { return this.configurations.baseUrl + '/api/student/StudentList'; }
  get postStudentUrl() { return this.configurations.baseUrl + '/api/student/CreateStudent'; }
  get deleteStudent() { return this.configurations.baseUrl + '/api/student/Delete'; }
  get classListURL() { return this.configurations.baseUrl + '/api/student/ClassList'; }



  getStudentListEndpoint<T>(pageNumber: number, pageSize: number, classNameFilter?: string): Observable<T> {
    const endpointUrl = classNameFilter ? `${this.studentListUrl}/${pageNumber}/${pageSize}/${classNameFilter}` : `${this.studentListUrl}/${pageNumber}/${pageSize}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.getStudentListEndpoint(pageNumber, pageSize, classNameFilter));
      }));
  }
  postStudenEndpoint<T>(body: StudentFormViewModel): Observable<T> {


    return this.http.post<T>(this.postStudentUrl, JSON.stringify(body), this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.postStudenEndpoint(body));
      }));
  }
getClassList<T>():Observable<T>{
  return this.http.get<T>(this.classListURL);
}
  deleteStudentEndPoint<T>(id: string): Observable<T> {
    const endpointUrl = `${this.deleteStudent}/${id}`;

    return this.http.get<T>(endpointUrl, this.requestHeaders).pipe<T>(
      catchError(error => {
        return this.handleError(error, () => this.deleteStudentEndPoint(id));
      }));
  }
}
