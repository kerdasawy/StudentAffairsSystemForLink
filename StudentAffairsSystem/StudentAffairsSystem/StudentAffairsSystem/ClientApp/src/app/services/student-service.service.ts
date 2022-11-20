 
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';


import { Observable, Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { ListResponse } from '../models/ListResponse';
import { StudentListItemViewModel } from '../models/StudentListItemViewModel';
import { StudentEndpoint } from './StudentEndpoint';
 


@Injectable({
  providedIn: 'root'
})
export class StudentServiceService  {

  constructor(  private endpoints: StudentEndpoint
     ) { 
  


  }
 public getStudentList(pageNumber: number, pageSize: number, classNameFilter?: string):Observable<ListResponse<StudentListItemViewModel>>
 {
     return this.endpoints.getStudentListEndpoint<ListResponse<StudentListItemViewModel>>(pageNumber,pageSize,classNameFilter);
 }
 public deleteStudent(id:string):Observable<string>
 {
    return this.endpoints.deleteStudentEndPoint<string>(id);
  
 }
 
}
