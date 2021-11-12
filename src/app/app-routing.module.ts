import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementNotificationComponent } from './announcement-notification/announcement-notification.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { BannerComponent } from './banner/banner.component';
import { BulletinComponent } from './bulletin/bulletin.component';
import { ClassifieldComponent } from './classifield/classifield.component';
import { ConfessionComponent } from './confession/confession.component';
import { LoginComponent } from './login/login.component';
import { MassTimingComponent } from './mass-timing/mass-timing.component';
import { NavigationComponent } from './navigation/navigation.component';
import { OtpComponent } from './otp/otp.component';
import { UserComponent } from './user/user.component';
import { MassTimingCalenderComponent } from './mass-timing-calender/mass-timing-calender.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Navigation', component: NavigationComponent ,
    children : [
      { path: 'User', component: UserComponent },
      { path: 'Mass-timing', component: MassTimingCalenderComponent },
      { path: 'Banner', component: BannerComponent },
      { path: 'Announcement', component: AnnouncementComponent},
      { path: 'Classifield', component: ClassifieldComponent},
      { path: 'Confession' , component: ConfessionComponent},
      { path: 'Profile', component: BulletinComponent}
    ]
  },
  { path: 'Announcement-Notification/:mediaUrl', component:AnnouncementNotificationComponent},
  { path: 'OTP', component: OtpComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
