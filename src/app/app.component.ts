import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { PatientsPage } from '../pages/patients/patients';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { ClinicsPage } from '../pages/clinics/clinics';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;
  
  pages: Array<{title: string, component: any}>

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Consultas', component: AppointmentsPage },
      { title: 'Paciente', component: PatientsPage },
      { title: 'Consultorios', component: ClinicsPage },
      
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

  
}

