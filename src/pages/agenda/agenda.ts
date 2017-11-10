import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ModalSchedulePage } from './modal-schedule';
import moment from 'moment'
@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html',
})
export class AgendaPage {

  params: any;
  calendar: any;
  eventSource: any[] = [];
  schedules: any[] = [];
  appointments: any[] = [];
  loader: any;
  authUser: any;
  currentDate: any;
  self: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public medicService: MedicServiceProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public networkService: NetworkServiceProvider) {

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    this.params = this.navParams.data;
    this.calendar = {
      currentDate: new Date(),
      mode: 'month'
    }
    this.self = this;

  }

  markDisabled(date) {
   

    var current = moment().format("YYYY-MM-DD");
    var dateCal = moment(date).format("YYYY-MM-DD");
    
  
      
    return moment(dateCal).isBefore(current)


   
  }


  loadSchedules(date_from, date_to, loader) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.findSchedules(this.authUser.id, date_from, date_to)
        .then(data => {
          this.schedules = data;
          let events = [];
          data.forEach(schedule => {

        
            
            let title = schedule.office.name;
           
           
          
              let event = {
                title: title,
                startTime: new Date(moment(schedule.start).format("YYYY-MM-DD HH:mm")),
                endTime: new Date(moment(schedule.end).format("YYYY-MM-DD HH:mm")),
                startFormatted: moment(schedule.start).format("YYYY-MM-DD HH:mm"),
                endFormatted: moment(schedule.start).format("YYYY-MM-DD HH:mm"),
                //start: startEvent,
                //end: endEvent,
                allDay: false,
                office_id: schedule.office_id,
                medic_id: schedule.user_id,
                office: schedule.office,
                medic: schedule.user,
                background_color: schedule.backgroundColor

              }

              events.push(event);

         

           


          });
          
          this.eventSource = events;

          loader.dismiss();

        })
        .catch(error => {

          let message = 'Ha ocurrido un error obteniendo los horarios';

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

 openModalSchedule(){
   
   let modal = this.modalCtrl.create(ModalSchedulePage, { selectedDate: this.currentDate});
   modal.onDidDismiss(data => {

     /*if (data)
       this.getAppointmentsFromUser();*/



   });

   modal.present();
 }


  onEventSelected(evt) {
    console.log(evt)
  }

  onCurrentDateChanged(date) {

    let dateFrom = moment(date).startOf('month').format('YYYY-MM-DD');
    let dateTo = moment(date).endOf('month').format('YYYY-MM-DD');
    this.currentDate = moment(date).format('YYYY-MM-DD');

    console.log(dateFrom + ' - ' + dateTo)
    //console.log(moment(date).endOf('month').format('YYYY-MM-DD'));
    //this.loadAppointments(dateFrom, dateTo);
    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });

    loader.present();
    this.loadSchedules(dateFrom, dateTo, loader);

  }
  goHome(){
    this.navCtrl.popToRoot()
  }


}
