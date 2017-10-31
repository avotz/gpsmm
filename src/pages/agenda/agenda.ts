import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
//import { ModalReservationPage } from './modal-reservation';
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

  loadAppointments(date_from, date_to) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
     /* let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();*/

      /*this.medicService.findAppointments(this.authUser.id, this.params.clinic.id, date_from, date_to)
        .then(data => {
          this.appointments = [];

          data.forEach(appointment => {

            this.appointments.push(appointment);

          });

          this.loadSchedules(date_from, date_to, loader);


        })
        .catch(error => alert(JSON.stringify(error)));*/
    }

  }

  loadSchedules(date_from, date_to, loader) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.findSchedules(this.authUser.id, date_from, date_to)
        .then(data => {
          this.schedules = data;
          
          data.forEach(schedule => {

        
            let events = [];
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
                

              }

              events.push(event);

         

            this.eventSource = events;


          });

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

  isReserved(startSchedule, endSchedule) {
    let res = {
       res: 0,
       id: 0
    };

    for (var j = 0; j < this.appointments.length; j++) {

      if (this.appointments[j].end > startSchedule && this.appointments[j].start < endSchedule) {

        if (this.appointments[j].created_by == this.authUser.id){ //si fue el usuario logueado que creo la cita cambia el titulo a reservado
          res.res = 2
          res.id = this.appointments[j].id
           
        }else{ /// se pone titulo en no disponible
    
          res.res = 1
          res.id = this.appointments[j].id
        }
      }

    }

    return res

  }

  createIntervalsFromHours(date, from, until, slot) {

    until = Date.parse(date + " " + until);
    from = Date.parse(date + " " + from);

    let intervalLength = (slot) ? slot : 30;
    let intervalsPerHour = 60 / intervalLength;
    let milisecsPerHour = 60 * 60 * 1000;

    let max = (Math.abs(until - from) / milisecsPerHour) * intervalsPerHour;

    let time = new Date(from);
    let intervals = [];
    for (let i = 0; i <= max; i++) {
      //doubleZeros just adds a zero in front of the value if it's smaller than 10.
      let hour = this.doubleZeros(time.getHours());
      let minute = this.doubleZeros(time.getMinutes());
      intervals.push(hour + ":" + minute);
      time.setMinutes(time.getMinutes() + intervalLength);
    }
    return intervals;
  }


  doubleZeros(item) {

    return (item < 10) ? '0' + item : item;
  }

  onEventSelected(evt) {
    console.log(evt)
    if (evt.reserved == 1) return

    let current = new Date();

    if (evt.startTime < current && (evt.reserved == 1 || evt.reserved == 0)) {
      let toast = this.toastCtrl.create({
        message: 'No se puede reservar en horas pasadas',
        cssClass: 'mytoast error',
        duration: 3000
      });
      toast.present(toast);
      return
    }

    if (evt.reserved == 2)
      evt.show = 1;

    /*let modal = this.modalCtrl.create(ModalReservationPage, evt);
    modal.onDidDismiss(data => {

      if (data.date)
        this.onCurrentDateChanged(data.date);

      if(data.toHome)
        this.goHome()

    });
    modal.present();*/
  }

  onCurrentDateChanged(date) {

    let dateFrom = moment(date).format('YYYY-MM-DD');
    let dateTo = dateFrom; //moment(lastDay).format('YYYY-MM-DD');
    this.currentDate = dateFrom;

    console.log(dateFrom + ' - ' + dateTo)
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
