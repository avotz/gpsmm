import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import { ModalAppointmentPage } from '../appointments/modal-appointment';
import { ModalCalendarPage } from '../appointments/modal-calendar';
import { AppointmentServiceProvider } from '../../providers/appointment-service/appointment-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import moment from 'moment'
import { SERVER_URL } from '../../providers/config';

@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {

  serverUrl: String = SERVER_URL;
  appointments: Array<any> = [];
  authUser: any;
  submitAttempt: boolean = false;
  currentPage: any = 1;
  currentDate:any;
  lastPage: any = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public appointmentService: AppointmentServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    this.getAppointmentsFromUser();

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      if (this.currentPage === this.lastPage) {
        infiniteScroll.complete();
        return
      }


      //this.medicSearchForm.get('page').setValue(this.currentPage + 1)

      this.appointmentService.getAppointments(this.currentPage + 1, this.currentDate)
      .then(data => {
        
        // console.log(data)
        // this.scheduledAppointments = data//.scheduledAppointments;
        // loader.dismiss();
       
       /* data.data.forEach(appointment => {
          this.appointments.push(appointment);
        

        });*/
        this.appointments = data.data;
        //this.currentPage = data.currentPage
        //this.currentPage = data.current_page;
        //this.lastPage = data.last_page;
       

        console.log('Async operation has ended');
        infiniteScroll.complete();


      })
      .catch(error => {
        let message = 'Ha ocurrido un error en consultado tus citas ';

        let toast = this.toastCtrl.create({
          message: message,
          cssClass: 'mytoast error',
          duration: 3000
        });

        toast.present(toast);
        //loader.dismiss();
      });
     
    }

  }
  clearDate(){
    this.currentDate = '';
    this.getAppointmentsFromUser();
  }
  showCalendarPage(){
    
    //this.navCtrl.push(ModalAppointmentPage, {appointment: appointment, patient: appointment.patient});
    let modal = this.modalCtrl.create(ModalCalendarPage);
    modal.onDidDismiss(data => {
            console.log(data)
            if (data){
              this.currentDate = data.date;
              this.getAppointmentsFromUser();
            }
              
      
          
      
          });
          
    modal.present();
  }
  openAppointmentDetail(appointment){
    
    //this.navCtrl.push(ModalAppointmentPage, {appointment: appointment, patient: appointment.patient});
    let modal = this.modalCtrl.create(ModalAppointmentPage, {appointment: appointment, patient: appointment.patient});
    modal.onDidDismiss(data => {
      
            if (data)
              this.getAppointmentsFromUser();
      
          
      
          });
          
    modal.present();
  }
  deleteAppointment(item) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.appointmentService.delete(item.id)
        .then(data => {
          console.log(data)
          let index = this.appointments.indexOf(item)
          this.appointments.splice(index, 1);


          loader.dismiss();


        })
        .catch(error => {
          let message = 'Ha ocurrido un error eliminado el paciente';

          if (error.status == 403)
            message = 'No se puede eliminar paciente por que tiene citas iniciadas';

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
  getAppointmentsFromUser() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
  } else {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });

    loader.present();
    this.appointmentService.getAppointments(this.currentPage, this.currentDate)
      .then(data => {
        
        // console.log(data)
        // this.scheduledAppointments = data//.scheduledAppointments;
        // loader.dismiss();
        /*data.data.forEach(appointment => {
          this.appointments.push(appointment);
         
        });*/
        this.appointments = data;

        //this.currentPage = data.currentPage
        //this.currentPage = data.current_page;
        //this.lastPage = data.last_page;
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
  
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  goHome(){
    this.navCtrl.popToRoot();
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad appointmentPage');
  }

}
