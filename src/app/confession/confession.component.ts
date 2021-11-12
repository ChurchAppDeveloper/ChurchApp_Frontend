import { Component, OnInit } from '@angular/core';
import { OtpService } from '../otp.service';
import { ServicesService } from '../services.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confession',
  templateUrl: './confession.component.html',
  styleUrls: ['./confession.component.css']
})
export class ConfessionComponent implements OnInit {

  timeSlots:any = [{"time":"12:00 am","value":0},{"time":"1:00 am","value":1},{"time":"2:00 am","value":2},{"time":"3:00 am","value":3},{"time":"4:00 am","value":4},{"time":"5:00 am","value":5},{"time":"6:00 am","value":6},{"time":"7:00 am","value":7},{"time":"8:00 am","value":8},{"time":"9:00 am","value":9},
  {"time":"10:00 am","value":10},{"time":"11:00 am","value":11},{"time":"12:00 am","value":12},{"time":"1:00 pm","value":13},{"time":"2:00 pm","value":14},{"time":"3:00 pm","value":15},{"time":"4:00 pm","value":16},{"time":"5:00 pm","value":17},{"time":"6:00 pm","value":18},{"time":"7:00 pm","value":19},
  {"time":"8:00 pm","value":20},{"time":"9:00 pm","value":21},{"time":"10:00 pm","value":22},{"time":"11:00 pm","value":23}];
  
  confDate: any;
  today:any;
  confStartTime: any;
  confEndTime: any;
  phoneNumber: any;
  confessionId: any = '1';
  confDuration: any;
  durationList: any = [{"name":"10 Mins","value":10}, {"name":"15 Mins","value":15}, {"name":"20 Mins","value":20}];
  confData: any;
  slotData: any;
  userNumber:any = "";
  userRole:any = "";
  scheduleFlag:boolean = false;

  constructor(private toastr: ToastrService, private otpService: OtpService, private service: ServicesService) { }

  ngOnInit(): void {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    var yyyy = today.getFullYear();
    console.log(yyyy+'-'+mm+'-'+dd)
    this.today = yyyy+'-'+mm+'-'+dd

    this.userNumber = this.service.getUsernumber();
    this.userRole = this.service.getUserRole();
    this.otpService.phNumber.subscribe(phNumber => {
      this.phoneNumber = phNumber;
    });

    this.service.getConfesstion().subscribe(res => {
      this.confData = res;
      console.log(this.confData.Items[0]);
      if(this.confData.Count>0){
      this.confDate = this.confData.Items[0]?.confessionDate;
      this.confStartTime = this.confData.Items[0]?.startTime;
      this.confEndTime = this.confData.Items[0]?.endTime;
      this.confDuration = this.confData.Items[0]?.slotDuration;
      }else{
        this.scheduleFlag = true;
      }
    }, error => {
      console.log("error",error);
    });
    this.getSlots();
    
  }

  getSlots(){
    this.service.getSlotsByStatus('Booked').subscribe(res => {
      console.log(res);
      this.slotData = res;
    }, error => {
      console.log("error",error);
    });
  }
  setConfession(){
    let reqData = {
      "confessionId": "1",
      "phoneNumber": this.userNumber,
      "confessionDate" : this.confDate,
      "startTime": parseInt(this.confStartTime),
      "endTime": parseInt(this.confEndTime),
      "slotDuration": parseInt(this.confDuration)
    }

    console.log(reqData);

    this.service.setConfesstion(reqData).subscribe(res => {
      this.toastr.success('SUCCESS', 'Confession Scheduled successfully');
    }, error => {
      this.toastr.error('ERROR', error.error);
      console.log("error",error);
    });
  }
}
