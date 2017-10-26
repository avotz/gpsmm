import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';


@Component({
    selector: 'modal-request',
    templateUrl: 'modal-request.html',
})
export class ModalRequestPage {

    requestForm: FormGroup;
    authUser: any;
    isWaiting: boolean = null;
    errorSave;
    submitAttempt: boolean = false;
    isSaved: boolean = false;
    constructor(public platform: Platform, public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

    

        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        this.requestForm = formBuilder.group({
            name: ['', Validators.required],
            phone: ['', Validators.required],
            address: ['', Validators.required],
           
           

        });



    }
   
    send() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Solicitud Enviada Correctamente';
            let styleClass = 'success';


            if (this.requestForm.valid) {


                this.isWaiting = true;

               

                    this.clinicService.requestOffice(this.requestForm.value)
                        .then(data => {

                            if (data.error) {
                                message = data.error.message;
                                styleClass = 'error';
                            }

                            let toast = this.toastCtrl.create({
                                message: message,
                                cssClass: 'mytoast ' + styleClass,
                                duration: 3000
                            });
                            toast.present(toast);

                            this.isWaiting = null;
                            this.isSaved = true;
                            this.dismiss();
                            //this.navCtrl.push(HomePage);    


                        })
                        .catch(error => {
                            let message = 'Ha ocurrido un error enviando la solicitud.';
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


             

            } //isvalid
        }


    }//saverequest

   

    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ saved: true });
        else
            this.viewCtrl.dismiss();

    }

}
