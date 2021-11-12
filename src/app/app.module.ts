import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import Amplify, { Auth } from 'aws-amplify';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { MassTimingComponent } from './mass-timing/mass-timing.component';
import { OtpComponent } from './otp/otp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from './banner/banner.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { ClassifieldComponent } from './classifield/classifield.component';
import { ConfessionComponent } from './confession/confession.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { ToastrModule } from 'ngx-toastr';
import { AnnouncementNotificationComponent } from './announcement-notification/announcement-notification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDocViewerModule } from 'ngx-doc-viewer';


import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FlatpickrModule } from 'angularx-flatpickr';
import { MassTimingCalenderComponent } from './mass-timing-calender/mass-timing-calender.component';
import { FilterPipe } from './filter.pipe';
Amplify.configure({
  Auth:{
    mandatorySignIn:true,
    region: 'us-east-2',
    userPoolId: 'us-east-2_E1ULgsJNq',
    userPoolWebClientId: '68n4ssm85kgtdp3mdp9t5egrac',
    authenticationFlowType:'CUSTOM_AUTH'
  }

});

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    NavigationComponent,
    MassTimingComponent,
    OtpComponent,
    BannerComponent,
    AnnouncementComponent,
    ClassifieldComponent,
    ConfessionComponent,
    BulletinComponent,
    AnnouncementNotificationComponent,
 
    MassTimingCalenderComponent,
    FilterPipe 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    }),
    NgbModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxDocViewerModule,
  ],
  // exports: [MassTimingComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
