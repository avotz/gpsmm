import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Events } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';

import { PatientsPage } from '../patients/patients';
import { AppointmentsPage } from '../appointments/appointments';
import { ClinicsPage } from '../clinics/clinics';
import { AgendaPage } from '../agenda/agenda';

import { AppointmentServiceProvider } from '../../providers/appointment-service/appointment-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

//declare var FirebasePlugin: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  notifications: any;
  currentPage: any = 1;
  totalAppointments: number = 0;
  constructor(public navCtrl: NavController, public badge: Badge, public networkService: NetworkServiceProvider, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public events: Events) {
    
    this.getbadges();
    
    this.events.subscribe('notifications:updated', (count) => {
     
      this.notifications++;
      this.totalAppointments++;
    });

     this.events.subscribe('notifications:clear', (count) => {
     
       this.notifications = count;
       this.totalAppointments = count;

    });
    
  }
  
  async getbadges(){
    try {
      this.notifications = await this.badge.get();
      console.log(this.notifications);
    } catch (error) {
      console.error(error)
    }
  }

  ionViewWillEnter() { // THERE IT IS!!!
    //return this.getAppointmentsFromUser();
  }

  getAppointmentsFromUser() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.appointmentService.getAppointments(this.currentPage)
        .then(data => {

         this.totalAppointments = 0;

          //this.appointments = data;
          data.forEach(element => {
            this.totalAppointments = this.totalAppointments + element.appointments.length
          });
        
          loader.dismiss();

        })
        .catch(error => {
          console.log(error)
          let message = 'Ha ocurrido un error en consultado tus citas ';

          let toast = this.toastCtrl.create({
            message: message,
            cssClass: 'mytoast error',
            duration: 3000
          });

          toast.present(toast);
          loader.dismiss();
        });
    }
  }
 
  appointments() {
       
        this.badge.clear();
        this.events.publish('notifications:clear', 0);

        this.navCtrl.push(AppointmentsPage)
      
    
      }
    
      patients() {
    
        this.navCtrl.push(PatientsPage)
        
    
      }
      offices() {
        
         this.navCtrl.push(ClinicsPage)
          
        
          }
      agenda(){
        this.navCtrl.push(AgendaPage)
      }

}
