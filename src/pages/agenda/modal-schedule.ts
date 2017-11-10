import { Component } from '@angular/core';
import { Platform, NavParams, ViewController, ToastController, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClinicServiceProvider } from '../../providers/clinic-service/clinic-service';
import { MedicServiceProvider } from '../../providers/medic-service/medic-service';
import { ScheduleServiceProvider } from '../../providers/schedule-service/schedule-service';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

import moment from 'moment'
@Component({
    selector: 'modal-schedule',
    templateUrl: 'modal-schedule.html',
})
export class ModalSchedulePage {

    schedules: any[] = [];
    clinic: any;
    medic: any;
    reminder: any;
    authUser: any;
    clinics: any[] = [];
    ClinicSelected: any;
    isWaiting: boolean = null;
    scheduleForm: FormGroup;
    currentPage: any = 1;
    lastPage: any = 1;
    currentDate: any;
    rangeMinutes: string = '0, 30';
    step: any;
    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public scheduleService: ScheduleServiceProvider, public medicService: MedicServiceProvider, public loadingCtrl: LoadingController, public networkService: NetworkServiceProvider, public navCtrl: NavController, public formBuilder: FormBuilder) {
      
        this.currentDate = this.navParams.data.selectedDate;
       
        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
        console.log(moment.duration(this.authUser.settings.slotDuration).asMinutes());
        this.step = moment.duration(this.authUser.settings.slotDuration).asMinutes()
       
        if (this.step>30)
            this.rangeMinutes = this.range(0, 120, 30).join()
        else 
            this.rangeMinutes = this.range(0, 120, this.step).join()

        
        let dateFrom = moment(this.currentDate).startOf('month').format('YYYY-MM-DD');
        let dateTo = moment(this.currentDate).endOf('month').format('YYYY-MM-DD');
      

        console.log(dateFrom + ' - ' + dateTo)
       
        let loader = this.loadingCtrl.create({
            content: "Espere por favor...",

        });

        loader.present();
        this.loadSchedules(dateFrom, dateTo, loader);


        this.scheduleForm = formBuilder.group({
            title: [''],
            office_id: ['', Validators.required],
            date: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            backgroundColor: '#00a65a', //Success ('#00a65a')
            borderColor: '#00a65a',
        


        });


    }
    
    range(start, stop, step) {
        var a = [start], b = start;
        while (b < stop) { b += step; a.push(b) }
        return a;
    };
    generate_stepsTime(step) {
        var dt = new Date(1970, 0, 1, 0, 0, 0, 0),
            rc = [];
        while (dt.getDate() == 1) {
            rc.push(dt.getMinutes() + step);
            //dt.setMinutes(dt.getMinutes() + step);
        }
        return rc;
    }
    loadSchedules(date_from, date_to, loader) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.medicService.findSchedules(this.authUser.id, date_from, date_to)
                .then(data => {
                    this.schedules = data;
                    
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

                    // console.log(data)
                    // this.scheduledAppointments = data//.scheduledAppointments;
                    // loader.dismiss();
                    this.clinics = [];
                    data.data.forEach(clinic => {
                        this.clinics.push(clinic);

                    });

                    //this.currentPage = data.currentPage
                    this.currentPage = data.current_page;
                    this.lastPage = data.last_page;
                    loader.dismiss();

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
    saveSchedule() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let message = 'Cita Reservada Correctamente';
            let styleClass = 'success';
            let colors = ['#2A630F', '#558D00', '#77B000', '#8CCC00', '#A9D300']
            let currColor = colors[Math.floor((Math.random() * colors.length))];
           // console.log(this.scheduleForm.value)
            let schedule = this.scheduleForm.value;
            console.log(schedule)
            schedule.backgroundColor = currColor
            schedule.borderColor = currColor
            schedule.start = schedule.date + 'T' + schedule.start + ':00';
            schedule.end = schedule.date + 'T' + schedule.end + ':00';
            console.log(schedule)

            if (moment(schedule.start).isAfter(schedule.end)) {
                let toast = this.toastCtrl.create({
                    message: 'Hora invalida. La hora de inicio no puede ser mayor que la hora final!!!',
                    cssClass: 'mytoast error',
                    duration: 3000
                });
                toast.present(toast);

                return false;

            }

            if (moment(schedule.start).isSame(schedule.end)) {
                schedule.end = moment(schedule.start).add(this.step, 'minutes').format();
                console.log('same end '+ schedule.end)
            }

            if (this.isReserved(schedule.start, schedule.end)) {

                let toast = this.toastCtrl.create({
                    message: 'No se puede agregar el evento por que hay colision de horarios. Por favor revisar!!!',
                    cssClass: 'mytoast error',
                    duration: 3000
                });
                toast.present(toast);

                return false;
            }
/*
            this.isWaiting = true;
            this.scheduleService.save(schedule)
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

                    if (data.appointment)
                        this.appointment = data.appointment;

                    this.isWaiting = null;

                })
                .catch(error => {

                    let message = 'Ha ocurrido un error guardando la cita';

                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });

                    toast.present(toast);
                  
                    this.isWaiting = null;

                }
                );*/
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
    
    deleteSchedule(schedule) {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            let loader = this.loadingCtrl.create({
                content: "Espere por favor...",

            });

            loader.present();
            this.scheduleService.delete(schedule.delete_id)
                .then(data => {
                    console.log(data)
                   
                    let dataSchedule = { date: schedule.start };

                    loader.dismiss();
                    this.dismiss(dataSchedule);


                })
                .catch(error => {
                    let message = 'Ha ocurrido un error eliminado el horario';

                  
                    let toast = this.toastCtrl.create({
                        message: message,
                        cssClass: 'mytoast error',
                        duration: 3000
                    });
                    console.log(error);
                    toast.present(toast);
                    loader.dismiss();
                });
        }
    }
    goHome(){
        
        let data = { toHome: true };
        this.viewCtrl.dismiss(data);
        
    }
    parseDate(date) {
        return moment(date).format('YYYY-MM-DD h:mm A');
    }
    dismiss(dataDelete:any) {
       
        /*let data = { date: this.appointment.date };
       
         if(this.appointment.fromScheduledAppointments){

            if(dataDelete)
                this.viewCtrl.dismiss(dataDelete);
            else 
                this.viewCtrl.dismiss({date:''});  

         }else{
            if(dataDelete)
                this.viewCtrl.dismiss(dataDelete);
            else 
                this.viewCtrl.dismiss(data);   
          
         
        }*/
    }

}
