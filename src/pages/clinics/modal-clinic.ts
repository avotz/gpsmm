import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { provinces } from '../../providers/provinces';

@Component({
    selector: 'modal-clinic',
    templateUrl: 'modal-clinic.html',
})
export class ModalClinicPage {

    clinicForm: FormGroup;
    authUser: any;
    isWaiting: boolean = null;
    clinic: any;
    cantones: Array<any> = [];
    districts: Array<any> = [];
    errorSave;
    submitAttempt: boolean = false;
    isSaved: boolean = false;
    constructor(public platform: Platform, public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

        this.clinic = this.navParams.data;
        if(this.clinic.province)
            this.loadCantones(this.clinic.province)
        if(this.clinic.canton)
            this.loadDistricts(this.clinic.canton)

        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));

        this.errorSave = '';
        this.clinicForm = formBuilder.group({
            name: [this.clinic.name, Validators.required],
            phone: [this.clinic.phone, Validators.required],
            address: [this.clinic.address, Validators.required],
            province: [this.clinic.province, Validators.required],
            canton: [this.clinic.canton, Validators.required],
            district: [this.clinic.district, Validators.required],
            lat: [this.clinic.lat],
            lon: [this.clinic.lon],
            type: ['Consultorio Independiente']
           

        });



    }
    isPrivate(){
     
       return this.clinic.type == 'Clínica Privada';
    }
    saveClinic() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Consultorio Creado Correctamente';
            let styleClass = 'success';


            if (this.clinicForm.valid) {


                this.isWaiting = true;

                if (this.clinic.id) {

                    message = 'Consultorio Actualizado Correctamente';

                    this.clinicService.update(this.clinic.id, this.clinicForm.value)
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

                            let message = 'Ha ocurrido un error registrando el consultorio.';
                            let errorSaveText = error.statusText;
                            
                            if(error.status == 422)
                            {
                                let body = JSON.parse(error._body)
                                
                                errorSaveText = body.errors.email[0]

                                message = message + errorSaveText
                                
                             }

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

                } else {

                    this.clinicService.register(this.clinicForm.value)
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
                            let message = 'Ha ocurrido un error registrando el consultorio.';
                            let errorSaveText = error.statusText;
                            
                            if(error.status == 422)
                            {
                                let body = JSON.parse(error._body)
                                
                                errorSaveText = body.errors.email[0]

                                message = message + errorSaveText
                                
                             }

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


                } //else if

            } //isvalid
        }


    }//saveclinic

    onChangeProvince(evt) {
        console.log(provinces)
        this.loadCantones(evt);
      }
      onChangeCanton(evt) {
        console.log(evt)
        this.loadDistricts(evt);
      }
    
      loadCantones(prov) {
        provinces.forEach(provincia => {
          if (provincia.title == prov) {
            this.cantones = provincia.cantones
          }
    
        });
      }
      loadDistricts(cant) {
    
        this.cantones.forEach(canton => {
    
          if (canton.title == cant) {
            this.districts = canton.distritos
          }
    
        });
    
      }

   

    dismiss() {
        if (this.isSaved)
            this.viewCtrl.dismiss({ saved: true });
        else
            this.viewCtrl.dismiss();

    }

}
