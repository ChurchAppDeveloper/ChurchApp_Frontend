import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { OtpService } from '../otp.service';
import { BehaviorSubject } from 'rxjs';
import { Auth } from 'aws-amplify';
import { ServicesService } from '../services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  password:any
  passwordType:any="password"
  visible:boolean=true
  sms: any = "";
  otp: any = "";
  otpStatus: boolean = true;
  extension: any = "+1";
  private busy_ = new BehaviorSubject(false);
  public busy = this.busy_.asObservable();

  private errorMessage_ = new BehaviorSubject('');
  public errorMessage = this.errorMessage_.asObservable();
  loginBtn: boolean = true;
  submitBtn: boolean = true;
  loading: boolean = false;
  constructor(private router: Router, private auth: OtpService, private service: ServicesService, private toastr: ToastrService) { }

  formSubmit(value) {
    if (this.otpStatus) {
      this.login();
    } else {
      this.checkUserAvailable(value)
    }
  };

  public checkUserAvailable(phoneNumber) {
    // this.router.navigate(['/Navigation/Banner']);
    this.loading = true;
    this.service.getCurrentUser(phoneNumber).subscribe(res => {
      let respObj: any;
      respObj = res;
      console.log(respObj);
      if (respObj.success) {
        this.loading = false;
        this.toastr.success('', respObj.message);
        this.otpStatus = true
      } else {
        this.loading = false;
        this.toastr.error('', respObj.message);
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
      this.toastr.error('', "Try Again Later");
    }
    );
    // this.service.getCurrentUser(phoneNumber).subscribe(res => {
    //   let respObj: any;
    //   respObj = res;
    //   console.log(respObj.Count);
    //   if(!(respObj.Count > 0)){
    //     let reqData = {
    //       "phoneNumber" : phoneNumber,
    //       "userRole" : 'Contributor'
    //     }
    //     this.service.addUser(reqData).subscribe(res => {
    //       this.getCurrentUser(phoneNumber);
    //       this.toastr.success('New User', 'Welcome');
    //       this.router.navigate(['/Navigation/Banner']);
    //     });
    //   }
    //   else{
    //     console.log("respObj",respObj);
    //     this.router.navigate(['/Navigation/Banner']);
    //     localStorage.setItem('userNumber', respObj.Items[0].phoneNumber);
    //     localStorage.setItem('userRole', respObj.Items[0].userRole);
    //   }
    //   this.service.getUsernumber();
    //   this.service.getUserRole();
    // }, error => {
    //   console.log("error",error);
    // });
  }
  login() {
 
    let body = new URLSearchParams();
    body.set('username', this.sms);
    body.set('password', this.password);
    body.set('grant_type', "password");
    body.set('client_id', "barnabas");
    this.loading = true;
    this.service.getLogin("login", body.toString()).subscribe(res => {
      console.log(res)

      let data: any = res;

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', this.sms);
        this.router.navigate(['/Navigation/Banner']);
        this.toastr.success('', "Login Successfully");
        this.loading = false;

      } else {
        this.toastr.error('', "Login Again");
        // this.otpStatus = false;
        this.loading = false;

      }

    }, err => {
      if(err.status == 400){
        this.toastr.error('', "Please Check Phone Number and Password");
        this.loading = false;
     
      }else{
        this.toastr.error('', "Try Again Later");
        this.loading = false;
      }

      // this.otpStatus=false
    },
    );
    // localStorage.setItem('access_token', '784e37cb-78f6-4a1d-bf07-aee955781157');
    // this.router.navigate(['/Navigation/Banner']);
    // localStorage.setItem('user', this.sms);

  }
  getCurrentUser(phoneNumber) {
    this.service.getCurrentUser(phoneNumber).subscribe(res => {
      let data: any = res;
      localStorage.setItem('userNumber', data.phoneNumber);
      localStorage.setItem('userRole', data.userRole);
    });
  }

  public async signup() {
    this.checkUserAvailable(this.sms);
    await this.auth.setphNumber(this.sms);
    let phNumber: any;
    phNumber = this.extension + this.sms;
    console.log("phNumber", phNumber);
    this.errorMessage_.next('');
    this.busy_.next(true);
    try {
      await this.auth.signUp(phNumber, "user");
      await this.auth.signIn(phNumber);
      console.log("route to otp");
      this.router.navigate(['/OTP']);
    } catch (err) {
      console.log(err);
      if (err.code == "UsernameExistsException") {
        var userData = await this.auth.signIn(phNumber);
        console.log("route to otp");
        this.router.navigate(['/OTP']);
        console.log("userData :", userData);
      }
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }



  public async signIn() {
    this.busy_.next(true);
    this.errorMessage_.next('');
    let phNumber: any;
    phNumber = this.extension + this.sms;
    try {
      await this.auth.signIn(phNumber);
      //this.router.navigate(['/enter-secret-code']);
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }


  public async getUserDetails() {
    this.busy_.next(true);
    this.errorMessage_.next('');
    try {
      const userDetails = await this.auth.getUserDetails();
      userDetails.forEach(detail => {
        const control = new FormControl(detail.getValue());
        //this.userDetailsForm.addControl(detail.getName(), control);
      });
      //this.userDetails_.next(userDetails);
    } catch (err) {
      this.errorMessage_.next(err.message || err);
    } finally {
      this.busy_.next(false);
    }
  }

  loginFlag(ph) {
    if (ph.length > 0) {
      this.loginBtn = false;
    } else if (ph.length == 0) {
      this.loginBtn = true;
    }
  }

  otpChange(otp) {
    if (otp.length > 0) {
      this.submitBtn = false;
    } else if (otp.length == 0) {
      this.submitBtn = true;
    }
  }

  passwordTypeChange(){
    this.visible = !this.visible
    if(this.visible == false){
      this.passwordType="text"
    }else{
      this.passwordType="password"
    }
  }
}
