import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController,ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRequestPage } from './modal-request';
import { ModalClinicPage } from './modal-clinic';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';


@Component({
    selector: 'assignment-clinic',
    templateUrl: 'assignment-clinic.html',
})
export class AssignmentClinicPage {

    requestForm: FormGroup;
    clinics: Array<any> = [];
    authUser: any;
    isWaiting: boolean = null;
    errorSave;
    submitAttempt: boolean = false;
    isSaved: boolean = false;
    constructor(public platform: Platform, public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider, public modalCtrl: ModalController) {

    

        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        



    }

    assignOffice(office){
        
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Clinica agregada correctamente';
            let styleClass = 'success';
            
    

             this.isWaiting = true;

             this.clinicService.assignOffice(office.id)
             .then(data => {

                 if (data.error) {
                     message = data.error.message;
                     styleClass = 'error';
                 }
                 if (data.message) {
                    message = data.message;
                    styleClass = 'success';
                }
                 
                 let toast = this.toastCtrl.create({
                     message: message,
                     cssClass: 'mytoast ' + styleClass,
                     duration: 3000
                 });
                 toast.present(toast);

                 this.isWaiting = null;
                 this.isSaved = true;
                


             })
             .catch(error => {
                 let message = 'Ha ocurrido un error agregando la clínica.';
                 let errorSaveText = error.statusText;
                 

                 let toast = this.toastCtrl.create({
                    message: message,
                    cssClass: 'mytoast error',
                    duration: 3000
                  });
        
                  toast.present(toast);
                  this.isWaiting = null;
                
                 
                 this.errorSave = errorSaveText
                 console.log(error);

             });
               


             

           
        }
        
      }
    
   
    getClinics(ev: any) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Solicitud Enviada Correctamente';
            let styleClass = 'success';
            
            if(!ev.target.value)
            {
                this.clinics = [];
                return
            }
                 

             this.isWaiting = true;

           

             let search = {
                q: ev.target.value
                
             }
           
             this.clinicService.findAll(search)
             .then(data => {
                 //loader.dismiss();

                 this.clinics = data;
                 this.isWaiting = false;
             })
             .catch(error => {
               alert(error.statusText)
               console.log(JSON.stringify(error))
               this.isWaiting = false;
             });
               


             

           
        }


    }//saverequest
    newRequestOffice(){
        
        //this.navCtrl.push(ModalClinicPage, clinic);
    
        let modal = this.modalCtrl.create(ModalRequestPage);

        modal.present();
        
      }
    
      newClinic(){
        
        //this.navCtrl.push(ModalClinicPage, clinic);
    
        let modal = this.modalCtrl.create(ModalClinicPage);
        modal.onDidDismiss(data => {
          
            if (data)
                this.isSaved = true;
              
          
              });
    
        modal.present();
        
      }
   
      goHome(){
        //this.navCtrl.popToRoot();
        let data = { toHome: true };
        this.viewCtrl.dismiss(data);
      }
    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ saved: true });
        else
            this.viewCtrl.dismiss();

    }

}
