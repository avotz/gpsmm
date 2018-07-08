import { Component } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';
import moment from 'moment'

@Component({
  selector: 'modal-calendar',
  templateUrl: 'modal-calendar.html',
})
export class ModalCalendarPage {
    calendar: any;
    currentDate: any;
    isVisible:boolean = false;
  constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController) {
    this.calendar = {
        currentDate: moment().toDate(),
        mode: 'month',
        
      }
    
  }
 
  
  dateFormat(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  onCurrentDateChanged(date) {
    if(this.isVisible){
        let data = { date: this.dateFormat(date) };

        this.viewCtrl.dismiss(data);   
    }else{
        this.isVisible = true;
    }
    
    

  }
  
  dismiss() {

    this.viewCtrl.dismiss();

  }

}
