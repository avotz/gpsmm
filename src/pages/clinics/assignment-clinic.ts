import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    constructor(public platform: Platform, public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

    

        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        



    }
   
    getClinics(ev: any) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Solicitud Enviada Correctamente';
            let styleClass = 'success';

             this.isWaiting = true;

             
             let search = {
                q: ev.target.value
                
            }
             this.clinicService.findAll(search)
             .then(data => {
                 //loader.dismiss();

                 this.clinics = data.data;
                 this.isWaiting = false;
             })
             .catch(error => {
               alert(error.statusText)
               console.log(JSON.stringify(error))
               this.isWaiting = false;
             });
               


             

           
        }


    }//saverequest

   

    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ saved: true });
        else
            this.viewCtrl.dismiss();

    }

}
