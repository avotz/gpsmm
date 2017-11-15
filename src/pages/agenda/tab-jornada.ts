import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ScheduleServiceProvider } from '../../providers/schedule-service/schedule-service';

import moment from 'moment'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { CalendarComponent } from "ionic2-calendar/calendar";

@Component({
  selector: 'tab-jornada',
  templateUrl: 'tab-jornada.html',
})
export class TabJornadaPage {
  
  @ViewChild(CalendarComponent) calendar: CalendarComponent;
  eventSource: any[] = [];
  markDays: any[] = [];
  schedules: any[] = [];
  schedulesToSave: any[] = [];
  clinics: any[] = [];
  currentDate: any = new Date(moment().format("YYYY-MM-DD HH:mm"))
  authUser: any;
  params:any;
  submitAttempt: boolean = false;
  isSaved: boolean = false;
  scheduleForm: FormGroup;
  currentPage: any = 1;
  lastPage: any = 1;
  clinicSelected: any;
  clinicColorSelected: string = '#00c0ef';
  isWaiting: boolean = null;
  schedulesLoaded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public clinicService: ClinicServiceProvider, public scheduleService: ScheduleServiceProvider, public medicService: MedicServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public networkService: NetworkServiceProvider, public platform: Platform, public formBuilder: FormBuilder) {

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
  
    /*this.calendar = {
      currentDate: new Date(),
      calendarMode: 'month',
     
    }*/
    this.scheduleForm = formBuilder.group({
      office_id: ['', Validators.required],
  
    });
    this.getClinicsFromUser();

    

  }
  loadSchedules(date_from, date_to, loader) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.findSchedules(this.authUser.id, date_from, date_to)
        .then(data => {
          this.schedules = data;
          this.schedulesLoaded = true
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
  getClinicsFromUser() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      let loader = this.loadingCtrl.create({
        content: "Espere por favor...",

      });

      loader.present();
      this.clinicService.findAllByMedic(this.currentPage)
        .then(data => {

          this.clinics = [];
          let colors = ['#00c0ef', '#00a65a', '#f39c12', '#dd4b39', '#A9D300']
          data.data.forEach((clinic, index) => {


            console.log(index)
            let currColor = colors[index];

            if (!currColor) currColor = '#00c0ef';
            clinic.currColor = currColor

            this.clinics.push(clinic);

          });

          //this.currentPage = data.currentPage
          this.currentPage = data.current_page;
          this.lastPage = data.last_page;
          let dateFrom = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
          let dateTo = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');

          console.log(this.clinics)
          this.loadSchedules(dateFrom, dateTo, loader);
          

        })
        .catch(error => {
          console.log(error)
          let message = 'Ha ocurrido un error en consultado tus clinicas ';

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
  onChange(evt) {

    if (this.clinics.find(x => x.id == evt)) {
      this.clinicSelected = this.clinics.find(x => x.id == evt).name
      this.clinicColorSelected = this.clinics.find(x => x.id == evt).currColor
    }
  }
  saveSchedules() {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.submitAttempt = true;
      let message = 'Horario programado correctamente';
      let styleClass = 'success';


      if (this.scheduleForm.valid) {
        this.schedulesToSave = [];
        this.markDays.forEach((eventDay, index) => {
          

          let schedule ={
            office_id: this.scheduleForm.get('office_id').value,
            backgroundColor : this.clinicColorSelected,
            borderColor: this.clinicColorSelected,
            start: eventDay.start,
            end: eventDay.end,
            date: eventDay.date,
            title: this.clinicSelected

          }
          if (!this.isReserved(schedule.start, schedule.end)) {

            this.schedulesToSave.push(schedule);
          }


          //this.schedulesToSave.push(schedule);

        });

       
        this.isWaiting = true;
        this.scheduleService.saveAll(this.schedulesToSave)
          .then(data => {
            console.log(data)

            if (data.error) {
              message = data.error.message;
              styleClass = 'error';
            }

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast ' + styleClass,
              duration: 3000
            });
            toast.present(toast);
            this.isSaved = true;
            this.isWaiting = null;
            this.submitAttempt = false;
            this.schedulesToSave = [];
            this.scheduleForm.reset()
            this.eventSource = [];
            this.calendar.loadEvents();
            let dateFrom = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
            let dateTo = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
            let loader = this.loadingCtrl.create({
              content: "Espere por favor...",

            });
            this.loadSchedules(dateFrom, dateTo, loader)

          })
          .catch(error => {

            let message = 'Ha ocurrido un error guardando el horario';

            let toast = this.toastCtrl.create({
              message: message,
              cssClass: 'mytoast error',
              duration: 3000
            });
            console.log(error);
            toast.present(toast);

            this.isWaiting = null;

          }
          );
      }
    }
  }
  isReserved(startSchedule, endSchedule) {
    let res = false;
    for (var j = 0; j < this.schedules.length; j++) {

      if (this.schedules[j].end > startSchedule && this.schedules[j].start < endSchedule) {

        res = true;

      }

    }

    return res

  }
  markDisabled(date) {


    var current = moment().format("YYYY-MM-DD");
    var dateCal = moment(date).format("YYYY-MM-DD");



     return moment(dateCal).isBefore(current)



  }

  onEventSelected(evt) {
    console.log(evt)
    
   
   
  }

  onCurrentDateChanged(date) {

  
    let event = {
      title: 'Horario',
      startTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
      endTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
      date: moment(date).format("YYYY-MM-DD"),
      ini: this.authUser.settings.minTime,
      fin: this.authUser.settings.maxTime,
      start: moment(date).format("YYYY-MM-DD") + 'T' + this.authUser.settings.minTime,
      end: moment(date).format("YYYY-MM-DD") + 'T' + this.authUser.settings.maxTime,
      allDay: false,

    }
    console.log(event)
  
    let index = this.markDays.findIndex(x => x.date === event.date);
    console.log('index'+ index)

    if(index !== -1){

      this.eventSource.splice(index, 1);
      this.markDays.splice(index, 1);
      this.calendar.loadEvents();
      console.log('se encontro')

    }else{
     
      if (this.isReserved(event.start, event.end)) {

        let toast = this.toastCtrl.create({
          message: 'No se puede seleccionar este día por que hay colision de horarios. Por favor revisar!!!',
          cssClass: 'mytoast error',
          duration: 3000
        });
        toast.present(toast);


      }else{

        if (this.schedulesLoaded){

          this.markDays.push(event);

          this.eventSource.push(event);
          this.calendar.loadEvents();

        }

      }
    
      

    
    }
    console.log(this.markDays)
  }
 

 

  ionViewDidLoad() {
    console.log('ionViewDidLoad tabMedicoPage');
  }

}
