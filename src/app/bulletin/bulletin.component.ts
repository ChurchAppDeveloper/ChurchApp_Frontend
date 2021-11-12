import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.css']
})
export class BulletinComponent implements OnInit {
  editFlag: boolean = true;
  profileInfo: any = "";
  phoneNumber: any = "";
  aboutUs: any = "";
  bulletinUrl: any = "";
  donateUrl: any = "";
  facebookUrl: any = "";
  ministersUrl: any = "";
  onlineReadingUrl: any = "";
  prayerRequestUtl: any = "";
  profileId: any = "";
  schoolUrl: any = "";
  websiteUrl: any = "";
  youtubeUrl: any = "";
  MassTimingIntention: any = "";
  role: any;
  confessionContact: any = "";
  confessionEmail: any = "";
  confessionDetails: any = "";
  loading: boolean = false;

  constructor(private toastr: ToastrService, private _servicesService: ServicesService) { }

  getProfileDetails() {
    console.log("profile")
    this._servicesService.get("myprofile")
      .subscribe(res => {
        //  console.log(res)
        let data: any = res
        console.log(data.content.churchProfile)
        this.profileInfo = data.content.churchProfile
        this.phoneNumber = this.profileInfo.contactUs;
        this.aboutUs = this.profileInfo.aboutUs;
        this.bulletinUrl = this.profileInfo.bulletIn;
        this.donateUrl = this.profileInfo.donate;
        this.facebookUrl = this.profileInfo.facebook;
        this.ministersUrl = this.profileInfo.ministers;
        this.onlineReadingUrl = this.profileInfo.onlineReading;
        this.prayerRequestUtl = this.profileInfo.prayerRequest;
        this.schoolUrl = this.profileInfo.school;
        this.websiteUrl = this.profileInfo.website;
        this.youtubeUrl = this.profileInfo.youtube;
        this.profileId = this.profileInfo.id;
        this.MassTimingIntention = this.profileInfo.massTimeIntention;
        this.confessionContact = this.profileInfo.confessionContact;
        this.confessionEmail = this.profileInfo.confessionEmail;
        this.confessionDetails = this.profileInfo.confessionDetails;
      })
  }

  ngOnInit(): void {
    this.getProfileDetails()
    // this._servicesService.getProfile().subscribe(res=> {
    //   let data:any = res;
    //   this.profileInfo = data.Items[0];
    //   this.phoneNumber = this.profileInfo.phoneNumber;
    //   this.aboutUs = this.profileInfo.aboutUs;
    //   this.bulletinUrl = this.profileInfo.bulletinUrl;
    //   this.donateUrl = this.profileInfo.donateUrl;
    //   this.facebookUrl = this.profileInfo.facebookUrl;
    //   this.ministersUrl = this.profileInfo.ministersUrl;
    //   this.onlineReadingUrl = this.profileInfo.onlineReadingUrl;
    //   this.prayerRequestUtl = this.profileInfo.prayerRequestUtl;
    //   this.schoolUrl = this.profileInfo.schoolUrl;
    //   this.websiteUrl = this.profileInfo.websiteUrl;
    //   this.youtubeUrl = this.profileInfo.youtubeUrl;
    //   this.profileId = this.profileInfo.profileId;
    //   this.MassTimingIntention = this.profileInfo.MassTimingIntention;
    //   console.log("res",this.profileInfo);
    // });
    // this.role = localStorage.getItem('userRole');

    // console.log(this.role)
  }

  editBtn() {
    this.editFlag == true ? this.editFlag = false : this.editFlag = true;
  }

  updateProfile(form:NgForm) {
    let data = {
      "aboutUs": this.aboutUs,
      "bulletIn": this.bulletinUrl,
      "contactUs": this.phoneNumber,
      "donate": this.donateUrl,
      "facebook": this.facebookUrl,
      "id": +this.profileId,
      "massTimeIntention": this.MassTimingIntention,
      "ministers": this.ministersUrl,
      "onlineReading": this.onlineReadingUrl,
      "prayerRequest": this.prayerRequestUtl,
      "school": this.schoolUrl,
      "website": this.websiteUrl,
      "youtube": this.youtubeUrl,
      "confessionContact": this.confessionContact,
      "confessionEmail": this.confessionEmail,
      "confessionDetails": this.confessionDetails,
    }
    this.loading = true;
    this._servicesService.post("createOrUpdateAllurl", data).subscribe(res => {
      let data: any = res;
      console.log(data)
      this.loading = false;
      this.toastr.success('', data.message);
      this.getProfileDetails()
    }, err => {
      // console.log(err)
      this.toastr.error('', "Try Again Later");
      this.loading=false
    },
    );
    // let data = {
    //   "phoneNumber": this.phoneNumber,
    //   "aboutUs": this.aboutUs,
    //   "ministersUrl": this.ministersUrl,
    //   "donateUrl": this.donateUrl,
    //   "websiteUrl": this.websiteUrl,
    //   "youtubeUrl": this.youtubeUrl,
    //   "facebookUrl": this.facebookUrl,
    //   "schoolUrl": this.schoolUrl,
    //   "bulletinUrl": this.bulletinUrl,
    //   "onlineReadingUrl": this.onlineReadingUrl,
    //   "prayerRequestUtl": this.prayerRequestUtl,
    //   "MassTimingIntention": this.MassTimingIntention,
    //   "profileId": this.profileId
    // }
    // this._servicesService.updateProfile(data).subscribe(res=> {
    //   let data:any = res;
    //   this.profileInfo = data.Items[0];
    //   this.editBtn(); 
    //   this.toastr.success('SUCCESS', 'Bullet-in successfully updated');
    // });
  }

}
