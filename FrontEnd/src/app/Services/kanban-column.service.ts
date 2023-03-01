import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { column, kanbanBoard } from '../models/kanbanboard.model';

@Injectable({
  providedIn: 'root'
})
export class KanbanColumnService {

  constructor(private http : HttpClient) { }

  getColumnsByKanbanId(idKanbanTable : number) {
    return this.http.get<column[]>(environment.url + "kanbanColumns/" + idKanbanTable);
  }

  addColumn(idKanbanTable : number, obj : any){
    return this.http.post<column>(environment.url + "createkanbanColumn/" + idKanbanTable, obj);
  }

  updateColumnName(idColumn : number, obj : any){
    return this.http.put(environment.url + "updatekanbanColumnName/" + idColumn, obj);
  }

  deleteColumn(idColumn : number){
    return this.http.delete<column[]>(environment.url + "deletekanbanColumn/" + idColumn);
  }
}
