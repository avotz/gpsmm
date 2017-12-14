import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';


@Injectable()
export class ScheduleServiceProvider {

  constructor(public http: Http) {
      console.log('Hello ScheduleServiceProvider Provider');
    this.http = http;
  }

  
   save(schedule){
       
        let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});

       
      
       return this.http.post(SERVER_URL + '/api/medic/schedules', schedule, options)
            .map(res => res.json())
           .toPromise();

           
             
    }
    update(schedule) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.put(SERVER_URL + '/api/medic/schedules/'+ schedule.id, schedule, options)
            .map(res => res.json())
            .toPromise();



    }
    saveAll(schedules) {

        let headers = new Headers({
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }),

            options = new RequestOptions({ headers: headers });



        return this.http.post(SERVER_URL + '/api/medic/schedules/all', schedules, options)
            .map(res => res.json())
            .toPromise();



    }
  
    delete(schedule_id){
    
   
     let headers = new Headers({'Accept': 'application/json',
     'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

      options = new RequestOptions({headers: headers});
     
        return this.http.delete(SERVER_URL + '/api/medic/schedules/' + schedule_id, options)
         .map(res => res.json())
        .toPromise();

        
          
 }
   findById(id) {
    
     
      let headers = new Headers({'Accept': 'application/json',
               'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

          options = new RequestOptions({headers: headers});


    return this.http.get(SERVER_URL + '/api/medic/schedules/'+ id, options)
        .map(res => res.json())
        .toPromise();

   
}
    findAllByUser(id) {
        
    
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers});


        return this.http.get(SERVER_URL + '/api/users/'+ id +'/schedules', options)
            .map(res => res.json())
            .toPromise();

       
    }
    getSchedules(page) {
        
         let search = {
            page: page ? page : 1,
             
          }
          
          let headers = new Headers({
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + window.localStorage.getItem('token')
          }),
  
            
          options = new RequestOptions({headers: headers,params: search});
  
          return this.http.get(SERVER_URL + '/api/medic/schedules', options)
              .map(res => res.json())
              .toPromise();
  
  
      }

}
