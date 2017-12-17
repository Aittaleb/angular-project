import { Injectable } from '@angular/core';

import {Http,Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class DeliveryService {
  private restAPI = '/api/deliveries';
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
  create(cb:any,err:any,delivery: any) : Promise<Object>
  {
    return this.http.post(this.getUrl(),delivery)
    .toPromise()
    .then(res => cb(res.json()) as Object)
    .catch(err);
  }

  /****    update     ***/
  update(cb:any,err:any,delivery: any): Promise<Object>
  {
    return this.http.put(this.getUrl()+`/${delivery._id}`,delivery)
    .toPromise()
    .then(res => cb(res.json()))
    .catch(err);
  }

  /**** delete ****/

  delete(cb:any,err:any,delivery: any):void
  {
    this.http.delete(this.getUrl()+`/${delivery._id}`)
    .toPromise()
    .then(res => cb(res.json()))
    .catch(err);

  }

  handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


}
