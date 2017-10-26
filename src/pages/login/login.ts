import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NetworkServiceProvider} from '../../providers/network-service/network-service';
import {AuthServiceProvider} from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  errorAuth;
  email;
  password;
  loginForm: FormGroup;
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public networkService: NetworkServiceProvider) {

  	   this.navCtrl = navCtrl;
       this.authService = authService;
       this.loadingCtrl = loadingCtrl;
       this.loginForm = formBuilder.group({
        email: ['',Validators.required],
        password: ['',Validators.required]
        
      });
  }

  
   login() {
    
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else { 
     
        this.submitAttempt = true;
        let loader = this.loadingCtrl.create({
          content: "Espere por favor...",
          //duration: 3000
        });

      
        if(this.loginForm.valid){
          loader.present();
          this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
                  .then(data => {

                    loader.dismiss();
                    console.log(data);
                    if(data.error)
                    {
                      this.errorAuth = data.error == 'Unauthenticated' ? 'Estas Credenciales no corresponden a ningun usuario registrado. Verifica!': data.error;
                      return;
                    }
            
                    window.localStorage.setItem('token', data.access_token);
                    window.localStorage.setItem('login_type', 'email');
                    window.localStorage.setItem('auth_user', JSON.stringify(data.user));
                    
                    this.errorAuth = "";
                    //this.navCtrl.setRoot(HomePage);

                   
                      this.navCtrl.setRoot(HomePage);
                     

                  })
                  .catch(error => {

                      alert(error)
                    
                    loader.dismiss();
                  });
        }
    }
        
  }

   

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
