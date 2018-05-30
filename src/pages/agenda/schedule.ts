import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ScheduleServiceProvider } from '../../providers/schedule-service/schedule-service';

import moment from 'moment'
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { CalendarComponent } from "ionic2-calendar/calendar";

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  @ViewChild(CalendarComponent) calendar: CalendarComponent;
  eventSource: any[] = [];
  markDays: any[] = [];
  schedules: any[] = [];
  schedulesToSave: any[] = [];
  clinics: any[] = [];
  currentDate: any = new Date(moment().format("YYYY-MM-DD HH:mm"))
  currentDateCalendar: any = new Date(moment().format("YYYY-MM-DD HH:mm"))
  currentMonth: any = moment().month()
  currentYear: any = moment().year()
  authUser: any;
  params: any;
  submitAttempt: boolean = false;
  isSaved: boolean = false;
  scheduleForm: FormGroup;
  currentPage: any = 1;
  lastPage: any = 1;
  clinicSelected: any;
  clinicColorSelected: string = '#00c0ef';
  isWaiting: boolean = null;
  schedulesLoaded: boolean = false;
  autoSelect: boolean = false;
  rangeMinutes: string = '0, 30';
  step: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public clinicService: ClinicServiceProvider, public scheduleService: ScheduleServiceProvider, public medicService: MedicServiceProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public networkService: NetworkServiceProvider, public platform: Platform, public formBuilder: FormBuilder, public viewCtrl: ViewController) {

    this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
    this.step = moment.duration(this.authUser.settings.slotDuration).asMinutes()

    if (this.step > 30)
      this.rangeMinutes = this.range(0, 120, 30).join()
    else
      this.rangeMinutes = this.range(0, 120, this.step).join()
    /*this.calendar = {
      currentDate: new Date(),
      calendarMode: 'month',
     
    }*/
    this.scheduleForm = formBuilder.group({
      office_id: ['', Validators.required],
      ini: [this.authUser.settings.minTime, Validators.required],
      fin: [this.authUser.settings.maxTime, Validators.required],
    });
    this.getClinicsFromUser();



  }
  range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) { b += step; a.push(b) }
    return a;
  };
  loadSchedules(date_from, date_to, loader) {
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.medicService.findSchedules(this.authUser.id, date_from, date_to)
        .then(data => {
          this.schedules = data;
          this.schedulesLoaded = true
          // this.calendar.eventSource = data;
          let events = [];
          data.forEach(schedule => {



            let title = schedule.office.name;
            //let isFS = this.isFullSchedule(schedule.start, schedule.end, schedule.date)

            

            let event = {
              id: schedule.id,
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
              background_color: '#6e6e6e', //gris para lo ya ocupados
              //isFS: isFS

            }

            events.push(event);






          });
          this.eventSource = events;
          loader.dismiss();
          console.log(events)
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
            let currColor = '#67BC9A';//colors[index];

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


          let schedule = {
            office_id: this.scheduleForm.get('office_id').value,
            backgroundColor: this.clinicColorSelected,
            borderColor: this.clinicColorSelected,
            start: moment(eventDay.date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('ini').value,
            end: moment(eventDay.date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('fin').value,
            date: eventDay.date,
            title: this.clinicSelected

          }
          if (!this.isReserved(schedule.start, schedule.end)) {

            this.schedulesToSave.push(schedule);
          }


          //this.schedulesToSave.push(schedule);

        });

        if (!this.schedulesToSave.length) {

          let toast = this.toastCtrl.create({
            message: 'Selecciona al menos un dia en el calendario!!!',
            cssClass: 'mytoast warning',
            duration: 3000
          });
          toast.present(toast);

          return
        }

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
            this.markDays = [];
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
  isFullSchedule(startSchedule, endSchedule, date) {
    let res = false;
    if (startSchedule == moment(date).format("YYYY-MM-DD") + 'T' + this.authUser.settings.minTime && endSchedule == moment(date).format("YYYY-MM-DD") + 'T' + this.authUser.settings.maxTime){
      res = true
    }

    return res

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

    let dateFrom = moment(date).startOf('month').format('YYYY-MM-DD');
    let dateTo = moment(date).endOf('month').format('YYYY-MM-DD');
    this.currentDate = moment(date).format('YYYY-MM-DD');

    if (this.currentMonth == moment(date).month() && this.currentYear == moment(date).year()) {
      let event = {
        title: 'Horario',
        startTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
        endTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
        date: moment(date).format("YYYY-MM-DD"),
        ini: this.scheduleForm.get('ini').value,
        fin: this.scheduleForm.get('fin').value,
        start: moment(date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('ini').value,
        end: moment(date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('fin').value,
        allDay: false,
        background_color: '#14B0A5' //primary para los seleccionados
      }


      let index = this.eventSource.findIndex(x => x.date === event.date);

      let indexMarkDays = this.markDays.findIndex(x => x.date === event.date);


      if (index !== -1) {

        this.eventSource.splice(index, 1);
        this.markDays.splice(indexMarkDays, 1);
        this.calendar.loadEvents();
        console.log('se encontro')

      } else {

        if (this.isReserved(event.start, event.end)) {

          let toast = this.toastCtrl.create({
            message: 'No se puede seleccionar este día por que hay colision de horarios. Por favor revisar!!!',
            cssClass: 'mytoast error',
            duration: 3000
          });
          toast.present(toast);


        } else {

          if (this.schedulesLoaded) {

            this.markDays.push(event);

            this.eventSource.push(event);
            this.calendar.loadEvents();

          }

        }

      }
      console.log(this.markDays)
      console.log(this.eventSource)
    } else {

      this.currentMonth = moment(date).month()
      this.currentYear = moment(date).year()

      this.loadEventsOfMonth(date, dateFrom, dateTo)
    }




  }

  loadEventsOfMonth(date, dateFrom, dateTo) {

    let loader = this.loadingCtrl.create({
      content: "Espere por favor...",

    });
    if (this.networkService.noConnection()) {
      this.networkService.showNetworkAlert();
    } else {
      this.schedulesLoaded = false
      this.medicService.findSchedules(this.authUser.id, dateFrom, dateTo)
        .then(data => {
          this.schedules = data;
          this.schedulesLoaded = true

          let events = [];
          data.forEach(schedule => {



            let title = schedule.office.name;
           // let isFS = this.isFullSchedule(schedule.start, schedule.end, schedule.date)


            let event = {
              id: schedule.id,
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
              background_color: '#6e6e6e', //gris para lo ya ocupados
             // isFS: isFS
            }

            events.push(event);






          });
          console.log(events)
          this.markDays.forEach(markDay => {
            events.push(markDay);
          });

          this.eventSource = events;
          loader.dismiss();

          let event = {
            title: 'Horario',
            startTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
            endTime: new Date(moment(date).format("YYYY-MM-DD HH:mm")),
            date: moment(date).format("YYYY-MM-DD"),
            ini: this.scheduleForm.get('ini').value,//this.authUser.settings.minTime,
            fin: this.scheduleForm.get('fin').value,//this.authUser.settings.maxTime,
            start: moment(date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('ini').value,
            end: moment(date).format("YYYY-MM-DD") + 'T' + this.scheduleForm.get('fin').value,
            allDay: false,
            background_color: '#14B0A5' //primary para los seleccionados
          }
          console.log(event)

          let index = this.eventSource.findIndex(x => x.date === event.date);
          console.log('index' + index)
          let indexMarkDays = this.markDays.findIndex(x => x.date === event.date);
          console.log('index' + index)

          if (index !== -1) {

            this.eventSource.splice(index, 1);
            this.markDays.splice(indexMarkDays, 1);
            this.calendar.loadEvents();
            console.log('se encontro')

          } else {

            var current = moment().format("YYYY-MM-DD");

            if (!moment(date).isBefore(current)) {

              if (this.isReserved(event.start, event.end)) {

                let toast = this.toastCtrl.create({
                  message: 'No se puede seleccionar este día por que hay colision de horarios. Por favor revisar!!!',
                  cssClass: 'mytoast error',
                  duration: 3000
                });
                toast.present(toast);


              } else {



                if (this.schedulesLoaded) {

                  this.markDays.push(event);

                  this.eventSource.push(event);
                  this.calendar.loadEvents();

                }

              }
            }

          }
          console.log(this.markDays)





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

  dismiss() {
    
    let data = { date: this.currentDate };

    if (this.isSaved) {

      this.viewCtrl.dismiss(data);

    } else {

      this.viewCtrl.dismiss();


    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad tabMedicoPage');
  }

}
