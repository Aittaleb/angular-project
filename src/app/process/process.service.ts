import { Injectable } from '@angular/core';
import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class ProcessService {
  private restAPI = '/api/processes';
  private host = 'http://localhost';
  private port='3000';

  getUrl()
  {
    return this.host+':'+this.port+this.restAPI;
  }

  constructor(private http:Http) { }

  /****************GET ALL*******************/

  list(cb:any,err:any):Promise<Object[]>
  {
    return this.http.get(this.getUrl())
    .toPromise()
    .then(res => cb(res.json()) as Object[])
    .catch(err);
  }
  /****************GET with id*******************/
  read(cb:any,err:any,id:string):Promise<Object>
  {
    return this.http.get(this.getUrl()+`/${id}`)
    .toPromise()
    .then(res => cb(res.json()) as Object)
    .catch(err);
  }
  /***********************Post ******/
  create(cb:any,err:any,process: any) : Promise<Object>
  {
    return this.http.post(this.getUrl(),process)
    .toPromise()
    .then(res => cb(res.json()) as Object)
    .catch(err);
  }

  /****    update     ***/
  update(cb:any,err:any,process: any): Promise<Object>
  {
    return this.http.put(this.getUrl()+`/${process._id}`,process)
    .toPromise()
    .then(res => cb(res.json()))
    .catch(err);
  }

  /**** delete ****/

  delete(cb:any,err:any,process: any):void
  {
    this.http.delete(this.getUrl()+`/${process._id}`)
    .toPromise()
    .then(res => cb(res.json()))
    .catch(err);

  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
