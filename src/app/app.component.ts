import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Badge } from '@ionic-native/badge';
//import { FCM } from '@ionic-native/fcm';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { PatientsPage } from '../pages/patients/patients';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { ClinicsPage } from '../pages/clinics/clinics';
import { AccountPage } from '../pages/account/account';
import { AgendaPage } from '../pages/agenda/agenda';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';

declare var FirebasePlugin: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;
  
  pages: Array<{title: string, component: any}>

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController, public authService: AuthServiceProvider, public badge: Badge, public events: Events/*, public fcm: FCM*/) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

     /* fcm.getToken().then(token => {
        console.log(token)
        if (token) {
          window.localStorage.setItem('push_token', token)
          this.savePushToken(token)
        }
      })

      fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          //alert(JSON.stringify(data));
          console.log("Received in background");
          this.badge.increase(1);
        } else {
          alert(JSON.stringify(data));
          // let alert = alertCtrl.create({
          //   title: data.notification.title,
          //   message: data.notification.body
          // })
          // alert.present()
          this.badge.increase(1);
        }
        //console.log(data)
        //alert(data);
       
      })

      fcm.onTokenRefresh().subscribe(token => {
        if (token) {
          window.localStorage.setItem('push_token', token)
          this.savePushToken(token)
        }
      })*/
      if(platform.is('ios')){
        FirebasePlugin.grantPermission(); //ios
        FirebasePlugin.hasPermission(function(data){
          console.log(data.isEnabled);
        });

      }
      if(platform.is('cordova')){
      FirebasePlugin.getToken(token => {
        // save this server-side and use it to push notifications to this device

        if (token) {
          window.localStorage.setItem('push_token', token)
          this.savePushToken(token)
          console.log(token);
          
        }
      }, (error) => {
        console.error(error);
        window.localStorage.setItem('push_token', '')
      })

      FirebasePlugin.onTokenRefresh(token => {
        // save this server-side and use it to push notifications to this device

        if (token) {
          window.localStorage.setItem('push_token', token)
          this.savePushToken(token)
          console.log(token);
          
        }

      }, (error) => {
        console.error(error)
        window.localStorage.setItem('push_token', '')
      })

      FirebasePlugin.onNotificationOpen(notification => {
        if (!notification.tap) {

          let confirm = this.alertCtrl.create({
            title: notification.title,
            message: notification.body,
            buttons: [
              {
                text: 'Cerrar',
                handler: () => {
                  confirm.dismiss();
                }
              },
              {
                text: 'Ir a citas',
                handler: () => {
                  this.nav.push(AppointmentsPage);
                }
              }
            ]
          });
          confirm.present();
          // let alert = alertCtrl.create({
          //   title: notification.title,
          //   message: notification.body
          // })
          // alert.present()

         
        }
        this.badge.increase(1);
        this.events.publish('notifications:updated', 1);

      }, (error) => {
        console.error(error);
      })

    }else{
      console.log('firebase notification en chrome esta desabilitado')

    }

    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Consultas', component: AppointmentsPage },
      { title: 'Agenda programada', component: AgendaPage },
      { title: 'Paciente', component: PatientsPage },
      { title: 'Consultorios', component: ClinicsPage },
      { title: 'Cuenta', component: AccountPage },
      
    ];
   
    this.checkPreviousAuthorization(); 
  }

  checkPreviousAuthorization(): void { 
    
      if((window.localStorage.getItem('token') === "undefined" || window.localStorage.getItem('token') === null)) {
        this.rootPage = LoginPage;
      } else {
       
          this.rootPage = HomePage;
      }
      
      
    } 
    
    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.push(page.component);
    }
  
    logout(): void {
     
        window.localStorage.removeItem('auth_user');
        window.localStorage.removeItem('token');
      
         
        
        
        window.localStorage.removeItem('login_type');
  
        this.nav.setRoot(LoginPage);
       
      }
    
    savePushToken(token) {
      let auth = JSON.parse(window.localStorage.getItem('auth_user'));

      if (auth) {
        this.authService.updatePushToken({ push_token: token })
          .then(data => {

            console.log('se actualizo token de las notificaciones ' + token)
            window.localStorage.setItem('auth_user', JSON.stringify(data));
            window.localStorage.setItem('push_token', token);
            this.rootPage = HomePage;


          })
          .catch(error => {

            console.error(error);


          });
      }
    }

  
}

