import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PatientsPage } from '../patients/patients';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  appointments() {
    
       // this.navCtrl.push(SearchMedicPage)
      
    
      }
    
      patients() {
    
        this.navCtrl.push(PatientsPage)
        
    
      }
      offices() {
        
          //  this.navCtrl.push(SearchClinicPage)
          
        
          }
      review(){
        //this.navCtrl.push(ReviewPage);
      }

}
