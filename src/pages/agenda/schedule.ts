import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabJornadaPage } from './tab-jornada';
import { TabDiaPage } from './tab-dia';


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
  
  
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad schedulePage');
  }

}
