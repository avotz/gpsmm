import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SERVER_URL } from '../../providers/config';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

declare var cordova: any;




@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  serverUrl: String = SERVER_URL;
  accountForm: FormGroup;
  errorAuth;
  tags;
  user: any;
  lastImage: string = null;

  freeDaysList = {
    lun: false,
    mar: false,
    mie: false,
    jue: false,
    vie: false,
    sab: false,
    dom: false
  };
  arrayFreeDays: Array<any> = []; 
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public toastCtrl: ToastController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public networkService: NetworkServiceProvider) {

    this.navCtrl = navCtrl;
    
    this.user = JSON.parse(window.localStorage.getItem('auth_user'));
    this.user.specialities = [];

    console.log(JSON.stringify(this.user))

    this.accountForm = formBuilder.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, Validators.required],
      password: ['', Validators.minLength(6)],
      phone_country_code: [this.user.phone_country_code, Validators.required],
      phone_number: [this.user.phone_number, Validators.required],
      medic_code: [this.user.medic_code, Validators.required],
      minTime: [this.user.settings ? this.user.settings.minTime : ''],
      maxTime: [this.user.settings ? this.user.settings.maxTime : ''],
      freeDays: [this.user.settings ? this.user.settings.freeDays : ''],
      lun: [this.freeDaysList.lun],
      mar: [this.freeDaysList.mar],
      mie: [this.freeDaysList.mie],
      jue: [this.freeDaysList.jue],
      vie: [this.freeDaysList.vie],
      sab: [this.freeDaysList.sab],
      dom: [this.freeDaysList.dom]
    });

    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
     
      this.authService.getUser()
        .then(resp => {
          
          this.user = resp;
          //let d = new Date();
          //this.user.photo = this.user.avatar_path + '?' + d.getTime()

          console.log(resp)
         
          window.localStorage.setItem('auth_user', JSON.stringify(resp));

          this.transformToForm_FreeDays(JSON.parse(this.user.settings.freeDays))
          
             

              this.accountForm.get('name').setValue(this.user.name)
              this.accountForm.get('email').setValue(this.user.email)
              this.accountForm.get('phone_country_code').setValue(this.user.phone_country_code)
              this.accountForm.get('phone_number').setValue(this.user.phone_number)
              this.accountForm.get('medic_code').setValue(this.user.medic_code)
              this.accountForm.get('minTime').setValue(this.user.settings.minTime)
              this.accountForm.get('maxTime').setValue(this.user.settings.maxTime)
              this.accountForm.get('freeDays').setValue(this.user.settings.freeDays)
              this.accountForm.get('lun').setValue(this.freeDaysList.lun)
              this.accountForm.get('mar').setValue(this.freeDaysList.mar)
              this.accountForm.get('mie').setValue(this.freeDaysList.mie)
              this.accountForm.get('jue').setValue(this.freeDaysList.jue)
              this.accountForm.get('vie').setValue(this.freeDaysList.vie)
              this.accountForm.get('sab').setValue(this.freeDaysList.sab)
              this.accountForm.get('dom').setValue(this.freeDaysList.dom)
              
          
          loader.dismissAll();
        })
        .catch(error => {

          let message = 'Ha ocurrido un error obteniendo la informacion de la cuenta';
          
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
  showSpecialities(specialities){
    let arraySpecialities = [];

    specialities.forEach(element => {
        arraySpecialities.push(element.name)
    });
    
    return arraySpecialities.join(' ')
  }
  transformToForm_FreeDays(days){
    //this.arrayFreeDays = [];

    days.forEach(element => {
      if(element == 1)
        this.freeDaysList.lun = true
      if(element == 2)
        this.freeDaysList.mar = true
      if(element == 3)
        this.freeDaysList.mie = true
      if(element == 4)
        this.freeDaysList.jue = true
      if(element == 5)
        this.freeDaysList.vie = true
      if(element == 6)
        this.freeDaysList.sab = true
      if(element == 0)
        this.freeDaysList.dom = true
    });
   
    

   
  }
  transformToArray_FreeDays(){
    this.arrayFreeDays = [];

    if(this.accountForm.get('lun').value)
      this.arrayFreeDays.push(1)
    if(this.accountForm.get('mar').value)
      this.arrayFreeDays.push(2)
    if(this.accountForm.get('mie').value)
      this.arrayFreeDays.push(3)
    if(this.accountForm.get('jue').value)
      this.arrayFreeDays.push(4)
    if(this.accountForm.get('vie').value)
      this.arrayFreeDays.push(5)
    if(this.accountForm.get('sab').value)
      this.arrayFreeDays.push(6)
    if(this.accountForm.get('dom').value)
      this.arrayFreeDays.push(0)

    this.accountForm.get('freeDays').setValue(this.arrayFreeDays)
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Cargar desde la biblioteca',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar la Camara',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('No se selecciono imagen.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      
        this.lastImage = newFileName;
      
      
      console.log(newFileName)
      
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text, styleClass = '') {
    let toast = this.toastCtrl.create({
      message: text,
      cssClass: 'mytoast ' + styleClass,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      // Destination URL
      var url = `${this.serverUrl}/api/account/avatars`;

      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);

      // File name only
      var filename = this.lastImage;
     
      var options = {
        fileKey: "avatar",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': filename },
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      let loader = this.loadingCtrl.create({
        content: 'Subiendo...',
      });
      loader.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        loader.dismissAll()
        this.presentToast('Imagen subida correctamente.');

        // let d = new Date();
        // this.user.avatar_path = '/storage/' + data.response + '?' + d.getTime();
        // window.localStorage.setItem('auth_user', JSON.stringify(this.user));
        // this.lastImage = null;
       
      }, err => {
        loader.dismissAll()
        console.log(err.body);
        
        let body = JSON.parse(err.body)

        if (body.errors.avatar){
          this.presentToast(body.errors.avatar[0],'error');
       
        }else{
          this.presentToast('Error mientras se subia el archivo.','error');

        }
      });
    }
  }

  update() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Cuenta Actualizada Correctamente';
      let styleClass = 'success';

      if (this.accountForm.valid) {


        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });
        this.transformToArray_FreeDays();

        loader.present();
       
        console.log(this.accountForm.value)
        console.log(this.arrayFreeDays)
        
        this.authService.update(this.accountForm.value)
          .then(data => {

            loader.dismiss();
            console.log(data);
            if (data.error) {
              this.errorAuth = data.error;
              return;
            }


            window.localStorage.setItem('auth_user', JSON.stringify(data));


            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast ' + styleClass,
              duration: 3000
            });
            toast.present(toast);
            this.errorAuth = "";
            this.clearForm(this.accountForm);



          })
          .catch(error => {

            let message = 'Ha ocurrido un error en actualizando la cuenta';
            
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
  }

  clearForm(form) {

    form.get('password').setValue('')


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }



}
