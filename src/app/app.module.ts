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
import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PatientServiceProvider } from '../providers/patient-service/patient-service';
import { AppointmentServiceProvider } from '../providers/appointment-service/appointment-service';
import { ClinicServiceProvider } from '../providers/clinic-service/clinic-service';
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
    AssignmentClinicPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    AssignmentClinicPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Diagnostic,
    InAppBrowser,
    PhotoViewer,
    Geolocation,
    NetworkServiceProvider,
    AuthServiceProvider,
    PatientServiceProvider,
    AppointmentServiceProvider,
    ClinicServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'es-CR'},
  ]
})
export class AppModule {}
