import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { ServicesService } from '../services.service';


@Component({
  selector: 'app-announcement-notification',
  templateUrl: './announcement-notification.component.html',
  styleUrls: ['./announcement-notification.component.css']
})
export class AnnouncementNotificationComponent implements OnInit {
  controlsFlag:boolean = true;
  announceID:any;
  announceData:any;
  mediaDisplay:any = "";
  constructor(private route: ActivatedRoute,private _servicesService: ServicesService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params => this.announceID = params.mediaUrl);
    console.log("announce id",this.announceID);
    this.getAnnounceData();
  }

  vidFunc(){
    let vid:any = document.getElementById("vid");
    vid.controls = true;
  }

  getAnnounceData(){
    this._servicesService.getAnnouncementsByID(this.announceID).subscribe(res=>{
      let data:any = res;
      this.announceData = data.Items[0];
      console.log("announceData",this.announceData.mediaUrl);
      if(this.announceData.mediaUrl.includes("video")){
        this.mediaDisplay = "video";
      }else if(this.announceData.mediaUrl.includes("image")){
        this.mediaDisplay = "image";
      }else if(this.announceData.mediaUrl.includes("audio")){
        this.mediaDisplay = "audio";
      }
    })
  }

}
