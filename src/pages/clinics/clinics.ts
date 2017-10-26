import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController, ActionSheetController } from 'ionic-angular';
import { ModalClinicPage } from './modal-clinic';
import { ModalRequestPage } from './modal-request';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import moment from 'moment'
import { SERVER_URL } from '../../providers/config';

@Component({
  selector: 'page-clinics',
  templateUrl: 'clinics.html',
})
export class ClinicsPage {

  serverUrl: String = SERVER_URL;
  clinics: Array<any> = [];
  authUser: any;
  submitAttempt: boolean = false;
  currentPage: any = 1;
  lastPage: any = 1;
  constructor(public navCtrl: NavController, public navParams: NavParams, public clinicService: ClinicServiceProvider, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

    this.getClinicsFromUser();

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

      this.clinicService.findAll(this.currentPage + 1)
      .then(data => {
        
        // console.log(data)
        // this.scheduledAppointments = data//.scheduledAppointments;
        // loader.dismiss();
       
        data.data.forEach(clinic => {
          this.clinics.push(clinic);
        

        });

        //this.currentPage = data.currentPage
        this.currentPage = data.current_page;
        this.lastPage = data.last_page;
       

        console.log('Async operation has ended');
        infiniteScroll.complete();


      })
      .catch(error => {
        let message = 'Ha ocurrido un error en consultado tus clinicas ';

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
  newRequestOffice(){
    
    //this.navCtrl.push(ModalClinicPage, clinic);

    let modal = this.modalCtrl.create(ModalRequestPage);
    modal.onDidDismiss(data => {
      
            if (data)
              this.getClinicsFromUser();
      
          
      
          });

    modal.present();
    
  }
  newClinic(){
    
    //this.navCtrl.push(ModalClinicPage, clinic);

    let modal = this.modalCtrl.create(ModalClinicPage);
    modal.onDidDismiss(data => {
      
            if (data)
              this.getClinicsFromUser();
      
          
      
          });

    modal.present();
    
  }
 
  openClinicDetail(clinic){
    
    //this.navCtrl.push(ModalClinicPage, clinic);
    let modal = this.modalCtrl.create(ModalClinicPage, clinic);
    modal.onDidDismiss(data => {
      
            if (data)
              this.getClinicsFromUser();
      
          
      
          });

    modal.present();
  }
  deleteClinic(item) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.clinicService.delete(item.id)
        .then(data => {
          console.log(data)
          let index = this.clinics.indexOf(item)
          this.clinics.splice(index, 1);


          loader.dismiss();


        })
        .catch(error => {
          console.log(error)
          let message = 'Ha ocurrido un error eliminado la clinica';


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
  getClinicsFromUser() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
  } else {
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });

    loader.present();
    this.clinicService.findAll(this.currentPage)
      .then(data => {
        
        // console.log(data)
        // this.scheduledAppointments = data//.scheduledAppointments;
        // loader.dismiss();
        this.clinics = [];
        data.data.forEach(clinic => {
          this.clinics.push(clinic);
         
        });

        //this.currentPage = data.currentPage
        this.currentPage = data.current_page;
        this.lastPage = data.last_page;
        loader.dismiss();

      })
      .catch(error => {
        console.log(error)
        let message = 'Ha ocurrido un error en consultado tus clinicas ';

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
  presentOptions(clinic) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      buttons: [
        {
          text: 'Ver Detalles',
          handler: () => {
            this.openClinicDetail(clinic)
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.deleteClinic(clinic)
          }
        }, {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('Cerrar clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad appointmentPage');
  }

}
