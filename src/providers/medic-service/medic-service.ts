import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from '../config';


@Injectable()
export class MedicServiceProvider {

  constructor(public http: Http) {
    console.log('Hello MedicServiceProvider Provider');
    this.http = http;
  }

  
  
    findSchedules(medic_id, date_from,date_to) {

      //url: '/medics/'+ externalEvent.data('doctor') +'/schedules/list?office='+ externalEvent.data('office'),

         let params = {
            //office: clinic_id,
            date1: date_from,
            date2: date_to
          }
          let headers = new Headers({'Accept': 'application/json',
                   'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),

              options = new RequestOptions({headers: headers,params: params});


        return this.http.get(SERVER_URL + '/api/medic/'+ medic_id +'/schedules/list' , options)
            .map(res => res.json())
            .toPromise();

    }
    findAppointments(medic_id, clinic_id,date_from,date_to) {
      
          
      
               let params = {
                  office: clinic_id,
                  date1: date_from,
                  date2: date_to
                }
                let headers = new Headers({'Accept': 'application/json',
                         'Authorization': 'Bearer '+ window.localStorage.getItem('token')}),
      
                    options = new RequestOptions({headers: headers,params: params});
      
      
              return this.http.get(SERVER_URL + '/api/medic/'+ medic_id +'/appointments/list' , options)
                  .map(res => res.json())
                  .toPromise();
      
          }
   

}
