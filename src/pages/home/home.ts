import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';

import { PatientsPage } from '../patients/patients';
import { AppointmentsPage } from '../appointments/appointments';
import { ClinicsPage } from '../clinics/clinics';
import { AgendaPage } from '../agenda/agenda';

//declare var FirebasePlugin: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController, public badge: Badge) {
    
  }

  appointments() {
       // FirebasePlugin.setBadgeNumber(0);
        this.badge.clear();
        this.navCtrl.push(AppointmentsPage)
      
    
      }
    
      patients() {
    
        this.navCtrl.push(PatientsPage)
        
    
      }
      offices() {
        
         this.navCtrl.push(ClinicsPage)
          
        
          }
      agenda(){
        this.navCtrl.push(AgendaPage)
      }

}
