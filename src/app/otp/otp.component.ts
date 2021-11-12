import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from '../otp.service';
import { ServicesService } from '../services.service'
import { BehaviorSubject, Subscription } from 'rxjs';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpComponent implements OnInit {
  answer:any;

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();

  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private allSubscriptions = new Subscription();

  private sms_ = new BehaviorSubject('');
  public sms = this.sms_.asObservable();
  phoneNumber: string;

  constructor(private auth: OtpService, private router: Router, private _servicesService:ServicesService) { }

  ngOnInit() {

    // Get e-mail address the code was sent to
    // It is a public challenge parameter so let's try it that way
    this.auth.getPublicChallengeParameters()
      .then(param => this.sms_.next(param.sms));
      this.auth.phNumber.subscribe(res=>{
        console.log("phNumber",res);
        this.phoneNumber = res;
      })
    
  }

  public async submit() {
    console.log("submit");
    try {
      this.errorMessage_.next('');
      this.busy_.next(true);
      console.log("this.answer",this.answer);
      const result:any = await this.auth.answerCustomChallenge(this.answer);
      console.log("if");
      if (result) {
        console.log("this.sms_",this.sms_);
        let user:any;
        await this._servicesService.getCurrentUser(this.phoneNumber).subscribe(res =>{
          let data:any = res;
          user = data.Items[0];
          console.log("user",user);
          localStorage.setItem('userNumber', user.phoneNumber);
          localStorage.setItem('userRole', user.userRole);
        this._servicesService.getUsernumber();
        this._servicesService.getUserRole();
        this.router.navigate(['/Navigation/User']);
        });
      } else {
        this.errorMessage_.next('That\'s not the right code');
      }
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }

}
