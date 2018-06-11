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
    clinicSelected: any;
    clinicColorSelected: string = '#67BC9A';
    isWaiting: boolean = null;
    scheduleForm: FormGroup;
    currentPage: any = 1;
    lastPage: any = 1;
    currentDate: any;
    rangeMinutes: string = '0, 30';
    step: any;
    submitAttempt: boolean = false;
    isSaved: boolean = false;
    schedule:any;
    constructor(public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public clinicService: ClinicServiceProvider, public scheduleService: ScheduleServiceProvider, public medicService: MedicServiceProvider, public loadingCtrl: LoadingController, public networkService: NetworkServiceProvider, public navCtrl: NavController, public formBuilder: FormBuilder) {
      
        this.schedule = this.navParams.data.schedule;
       
        this.authUser = JSON.parse(window.localStorage.getItem('auth_user'));
        console.log(moment.duration(this.authUser.settings.slotDuration).asMinutes());
        this.step = moment.duration(this.authUser.settings.slotDuration).asMinutes()
       
        if (this.step>30)
            this.rangeMinutes = this.range(0, 120, 30).join()
        else 
            this.rangeMinutes = this.range(0, 120, this.step).join()

        
        this.getClinicsFromUser();


        this.scheduleForm = formBuilder.group({
            title: [this.schedule.title],
            office_id: [this.schedule.office_id, Validators.required],
            date: [moment(this.schedule.startFormatted).format('YYYY-MM-DD'), Validators.required],
            ini: [moment(this.schedule.startFormatted).format('HH:mm'), Validators.required],
            fin: [moment(this.schedule.endFormatted).format('HH:mm'), Validators.required],
            //backgroundColor: [this.schedule.backgroundColor],  //Success ('#00a65a')
            //borderColor: ['#00a65a'],
        


        });

        console.log(this.schedule)
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
                    //let colors = ['#00c0ef', '#00a65a', '#f39c12', '#dd4b39', '#A9D300']
                    data.data.forEach((clinic,index)=> {

                     
                            console.log(index)
                            let currColor = '#67BC9A'//colors[index];

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
    updateSchedule() {
        if (this.networkService.noConnection()) {
            this.networkService.showNetworkAlert();
        } else {
            this.submitAttempt = true;
            let message = 'Horario actualizado correctamente';
            let styleClass = 'success';
           
          
            if (this.scheduleForm.valid) {
                let schedule = this.scheduleForm.value;
            
                schedule.backgroundColor = this.clinicColorSelected
                schedule.borderColor = this.clinicColorSelected
                schedule.start = schedule.date + 'T' + schedule.ini + ':00';
                schedule.end = schedule.date + 'T' + schedule.fin + ':00';
                schedule.title = this.clinicSelected
                schedule.id = this.schedule.id
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
                    schedule.end = moment(schedule.date + 'T' + schedule.ini + ':00').add(this.step, 'm').format('YYYY-MM-DDTHH:mm:ss');
                    console.log('same end '+ schedule.end)
                }

                if (this.isReserved(schedule.start, schedule.end, schedule.id)) {

                    let toast = this.toastCtrl.create({
                        message: 'No se puede agregar el evento por que hay colision de horarios. Por favor revisar!!!',
                        cssClass: 'mytoast error',
                        duration: 3000
                    });
                    toast.present(toast);

                    return false;
                }
    
                this.isWaiting = true;
                this.scheduleService.update(schedule)
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
                        this.dismiss()

                    })
                    .catch(error => {

                        let message = 'Ha ocurrido un error actualizando el horario';

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
    isReserved(startSchedule, endSchedule,schedule_id) {
        let res = false;
        for (var j = 0; j < this.schedules.length; j++) {
           
            if (this.schedules[j].id != schedule_id){
                if (this.schedules[j].end > startSchedule && this.schedules[j].start < endSchedule) {
                    
                        res = true;
                    
                }
            }

        }

        return res

    }
    onChange(evt){
      
       if(this.clinics.find(x => x.id == evt))
       {
           this.clinicSelected = this.clinics.find(x => x.id == evt).name
           this.clinicColorSelected = this.clinics.find(x => x.id == evt).currColor
       }
    }
   
    
    goHome(){
        
        let data = { toHome: true };
        this.viewCtrl.dismiss(data);
        
    }
    parseDate(date) {
        return moment(date).format('YYYY-MM-DD h:mm A');
    }
    dismiss() {
      
        let data = { date: moment().format('YYYY-MM-DD') };
       
        if (this.isSaved){

            this.viewCtrl.dismiss(data);   

         }else{

            this.viewCtrl.dismiss();  
          
         
        }
    }

}
