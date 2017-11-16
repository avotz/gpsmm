import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabJornadaPage } from './tab-jornada';
import { TabDiaPage } from './tab-dia';
import { AgendaPage } from '../agenda/agenda';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  
  params:any;
  tabJornada:any;
  tabDia:any;
  workdayTabParams:any;
  dayTabParams:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.params = this.navParams.data;
    this.workdayTabParams = this.params;
    this.dayTabParams = this.params;
    
    this.tabJornada = TabJornadaPage;
    this.tabDia = TabDiaPage;
   

  }
  
  
  back() {
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.push(AgendaPage)  // remember to put this to add the back button behavior
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad schedulePage');
  }

}
