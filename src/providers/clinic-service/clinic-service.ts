import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';


@Injectable()
export class ClinicServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ClinicServiceProvider Provider');
    this.http = http;
  }

  
   
    findAll(search) {
        
          /*let params = {
            q: search,
             
          }*/
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: search});


        return this.http.get(SERVER_URL + '/api/medic/offices', options)
            .map(res => res.json())
            .toPromise();

       
    }
    findById(id) {
      
       
        let headers = new Headers({'Accept': 'application/json',
                 'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

            options = new RequestOptions({headers: headers});


      return this.http.get(SERVER_URL + '/api/medic/offices/'+ id, options)
          .map(res => res.json())
          .toPromise();

     
  }
  register(form) {
    
            let headers = new Headers({
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
            }),
    
                options = new RequestOptions({ headers: headers });
    
    
    
            return this.http.post(SERVER_URL + '/api/medic/offices', form, options)
                .map(res => res.json())
                .toPromise();
    
    
    
        }
    requestOffice(form) {
          
                  let headers = new Headers({
                      'Accept': 'application/json',
                      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
                  }),
          
                      options = new RequestOptions({ headers: headers });
          
          
          
                  return this.http.post(SERVER_URL + '/api/medic/offices/request', form, options)
                      .map(res => res.json())
                      .toPromise();
          
          
          
              }
  delete(id) {
    
     
    let headers = new Headers({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + window.localStorage.getItem('token')
  }),

      options = new RequestOptions({ headers: headers });

  return this.http.delete(SERVER_URL + '/api/medic/offices/' + id, options)
      .map(res => res.json())
      .toPromise();

   
}
update(id, form) {
  
  
          let headers = new Headers({
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + window.localStorage.getItem('token')
          }),
  
              options = new RequestOptions({ headers: headers });
  
          return this.http.put(SERVER_URL + '/api/medic/offices/' + id, form, options)
              .map(res => res.json())
              .toPromise();
  
  
  
      }
   
  

}
