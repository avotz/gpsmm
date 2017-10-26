import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {SERVER_URL} from '../config';

const postData = {
          password:'',
          email:''
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
       
        return this.http.post(SERVER_URL + '/api/medic/token', postData)
            .map(res => res.json())
            .toPromise();

           
             
    }
   
    update(form){
      
       form.push_token = window.localStorage.getItem('push_token') 
       
       let headers = new Headers({'Accept': 'application/json',
       'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

        options = new RequestOptions({headers: headers});
       
       return this.http.put(SERVER_URL + '/api/account/edit', form, options)
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
    

}
