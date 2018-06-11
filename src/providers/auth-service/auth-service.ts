import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';

const postData = {
          password:'',
          email:'',
          push_token:'',
       };

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
    this.http = http;
  }

  login(email, password){
        postData.email = email
        postData.password = password
        postData.push_token = window.localStorage.getItem('push_token') 
       
        return this.http.post(SERVER_URL + '/api/medic/token', postData)
            .map(res => res.json())
            .toPromise();

           
             
    }
   
    update(form){
      
       form.push_token = window.localStorage.getItem('push_token') 
       
       let headers = new Headers({'Accept': 'application/json',
       'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

        options = new RequestOptions({headers: headers});
       
       return this.http.put(SERVER_URL + '/api/medic/account', form, options)
           .map(res => res.json())
          .toPromise();

          
            
   }
   updatePushToken(token){
    
   
     let headers = new Headers({'Accept': 'application/json',
     'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

      options = new RequestOptions({headers: headers});
     
     return this.http.put(SERVER_URL + '/api/account/updatepush', token, options)
         .map(res => res.json())
        .toPromise();

        
          
 }

 getUser() {
  
  
          let headers = new Headers({
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + window.localStorage.getItem('token')
          }),
  
              options = new RequestOptions({ headers: headers });
  
  
          return this.http.get(SERVER_URL + '/api/medic/account', options)
              .map(res => res.json())
              .toPromise();
  
  
      }
    

}
