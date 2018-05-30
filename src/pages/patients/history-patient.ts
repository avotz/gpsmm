import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import { PatientServiceProvider } from '../../providers/patient-service/patient-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ModalAppointmentPage } from '../appointments/modal-appointment';
import { SERVER_URL } from '../../providers/config';
import moment from 'moment'

@Component({
  selector: 'page-history-patient',
  templateUrl: 'history-patient.html',
})
export class HistoryPatientPage {

  serverUrl: String = SERVER_URL;
  patients: any = [];
  authUser: any;
  patient: any;
  appointments: any = [];
  submitAttempt: boolean = false;
  shownGroup = null;
  medical_control: string = "history";
  allergies: any;
  pathologicals: any;
  no_pathologicals: any;
  heredos: any;
  ginecos: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public patientService: PatientServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    this.patient = this.navParams.data;

    this.getHistories()

  }

  getHistories(refresher:any = null) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });
     

      loader.present();
      this.patientService.getHistory(this.patient.id)
        .then(data => {

          this.appointments = data.appointments;
          //this.labresults = data.labresults;
          // this.history = data.history;
           this.allergies = data.history.allergies;
           this.pathologicals = data.history.pathologicals;
           this.no_pathologicals = data.history.nopathologicals;
           this.heredos = data.history.heredos;
           this.ginecos = data.history.ginecos;
          loader.dismissAll();
          
          if(refresher)
            refresher.complete()

        })
        .catch(error => {

          console.log(error);
          loader.dismissAll();

          if(refresher)
            refresher.complete()

        });
    }
  }
  timeFormat(date) {
    return moment(date).format('h:mm A');
  }
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }
  isGroupShown(group) {
    return this.shownGroup === group;
  }

  openAppointmentDetail(appointment){
    this.navCtrl.push(ModalAppointmentPage, {appointment: appointment, patient: this.patient});
  }

  

  goHome(){
    this.navCtrl.popToRoot();
   
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PatientsPage');
  }

}
