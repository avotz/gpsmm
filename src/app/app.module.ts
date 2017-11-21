import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { HttpModule} from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { NgCalendarModule } from 'ionic2-calendar';
import { Badge } from '@ionic-native/badge';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PatientsPage } from '../pages/patients/patients';
import { ModalPatientPage } from '../pages/patients/modal-patient';
import { HistoryPatientPage } from '../pages/patients/history-patient';
import { ModalAppointmentPage } from '../pages/patients/modal-appointment';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { ClinicsPage } from '../pages/clinics/clinics';
import { ModalClinicPage } from '../pages/clinics/modal-clinic';
import { ModalRequestPage } from '../pages/clinics/modal-request';
import { AssignmentClinicPage } from '../pages/clinics/assignment-clinic';
import { AccountPage } from '../pages/account/account';
import { AgendaPage } from '../pages/agenda/agenda';
import { ModalSchedulePage } from '../pages/agenda/modal-schedule';
import { SchedulePage } from '../pages/agenda/schedule';
//import { TabJornadaPage } from '../pages/agenda/tab-jornada';
//import { TabDiaPage } from '../pages/agenda/tab-dia';

import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { AppointmentServiceProvider } from '../providers/appointment-service/appointment-service';
import { ClinicServiceProvider } from '../providers/clinic-service/clinic-service';
import { MedicServiceProvider } from '../providers/medic-service/medic-service';
import { ScheduleServiceProvider } from '../providers/schedule-service/schedule-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PatientsPage,
    ModalPatientPage,
    HistoryPatientPage,
    ModalAppointmentPage,
    AppointmentsPage,
    ClinicsPage,
    ModalClinicPage,
    ModalRequestPage,
    AssignmentClinicPage,
    AccountPage,
    AgendaPage,
    ModalSchedulePage,
    SchedulePage
   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PatientsPage,
    ModalPatientPage,
    HistoryPatientPage,
    ModalAppointmentPage,
    AppointmentsPage,
    ClinicsPage,
    ModalClinicPage,
    ModalRequestPage,
    AssignmentClinicPage,
    AccountPage,
    AgendaPage,
    ModalSchedulePage,
    SchedulePage
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Diagnostic,
    InAppBrowser,
    PhotoViewer,
    Geolocation,
    File,
    FilePath,
    Transfer,
    Camera,
    Badge,
    NetworkServiceProvider,
    AuthServiceProvider,
    PatientServiceProvider,
    AppointmentServiceProvider,
    ClinicServiceProvider,
    MedicServiceProvider,
    ScheduleServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'es-CR'},
  ]
})
export class AppModule {}
