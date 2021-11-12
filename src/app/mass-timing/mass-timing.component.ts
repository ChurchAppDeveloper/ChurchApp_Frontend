import { Component, OnInit } from '@angular/core';
import { start } from '@popperjs/core';
import { ServicesService } from '../services.service';
import { ToastrService } from 'ngx-toastr';
import { threadId } from 'worker_threads';

declare const $: any;


@Component({
  selector: 'app-mass-timing',
  templateUrl: './mass-timing.component.html',
  styleUrls: ['./mass-timing.component.css']
})
export class MassTimingComponent implements OnInit {

  timeSlots: any = [{ "time": "12:00 am", "value": "0" }, { "time": "1:00 am", "value": "1" }, { "time": "2:00 am", "value": "2" }, { "time": "3:00 am", "value": "3" }, { "time": "4:00 am", "value": "4" }, { "time": "5:00 am", "value": "5" }, { "time": "6:00 am", "value": "6" }, { "time": "7:00 am", "value": "7" }, { "time": "8:00 am", "value": "8" }, { "time": "9:00 am", "value": "9" },
  { "time": "10:00 am", "value": "10" }, { "time": "11:00 am", "value": "11" }, { "time": "12:00 am", "value": "12" }, { "time": "1:00 pm", "value": "13" }, { "time": "2:00 pm", "value": "14" }, { "time": "3:00 pm", "value": "15" }, { "time": "4:00 pm", "value": "16" }, { "time": "5:00 pm", "value": "17" }, { "time": "6:00 pm", "value": "18" }, { "time": "7:00 pm", "value": "19" },
  { "time": "8:00 pm", "value": "20" }, { "time": "9:00 pm", "value": "21" }, { "time": "10:00 pm", "value": "22" }, { "time": "11:00 pm", "value": "23" }];

  massMeeting: any;
  massMeetingMain: any = [];
  massMeetingMainWeekend: any = [];
  startTime: any = { hour: 13, minute: 30 };
  endTime: any = { hour: 13, minute: 30 };
  startReminder: any = "";
  endReminder: any = "";
  massMeetingData: any = [];
  massEvent: any;
  massEventMain: any = [];
  //monday slots
  mondayStartTime: any;
  mondayEndTime: any;
  mondayStartReminder: Boolean = false;
  mondaySlotList: Array<any> = [];

  //tuesday slots
  tuesdayStartTime: any;
  tuesdayEndTime: any;
  tuesdayStartReminder: Boolean = false;
  tuesdaySlotList: Array<any> = [];

  //wednesday slots
  wednesdayStartTime: any;
  wednesdayEndTime: any;
  wednesdayStartReminder: Boolean = false;
  wednesdaySlotList: Array<any> = [];


  //thursday slots
  thursdayStartTime: any;
  thursdayEndTime: any;
  thursdayStartReminder: Boolean = false;
  thursdaySlotList: Array<any> = [];

  //friday slots
  fridayStartTime: any;
  fridayEndTime: any;
  fridayStartReminder: Boolean = false;
  fridaySlotList: Array<any> = [];


  //saturday slots
  saturdayStartTime: any;
  saturdayEndTime: any;
  saturdayStartReminder: Boolean = false;
  saturdaySlotList: Array<any> = [];


  //sunday slots
  sundayStartTime: any;
  sundayEndTime: any;
  sundayStartReminder: Boolean = false;
  sundaySlotList: Array<any> = [];

  constructor(private toastr: ToastrService, private _servicesService: ServicesService) { }

  ngOnInit() {
    // this.getMassTiming();
    this.getTiming();
    this.getEventMeeting();
  }

  ngAfterViewInit() {
  }

  getEventMeeting() {
    this._servicesService.getEventMassMeeting().subscribe(res => {
      let data: any = res;
      this.eventSwap(data.Items);
      console.log("event ", data.Items);
    });
  }

  eventSwap(massMeeting) {
    console.log("times", massMeeting);
    this.massMeeting = [];
    for (let i = 0; i < massMeeting.length; i++) {
      var startTimeParsed = new Date(massMeeting[i].startTime);
      this.massEventMain.push({
        "eventId": massMeeting[i].eventId,
        "phoneNumber": massMeeting[i].phoneNumber,
        "days": massMeeting[i].days,
        "startTime": massMeeting[i].startTime,
        "startReminder": massMeeting[i].startReminder,
        "start": massMeeting[i].startReminder == true ? "ON" : "OFF",
        "startTimeParsed": { "hour": startTimeParsed.getHours(), "minute": startTimeParsed.getMinutes() },
      });
      console.log("massEventMain", this.massEventMain, " ", startTimeParsed);
    }
  }

  getMassTiming() {
    this._servicesService.getMassMeeting().subscribe(res => {
      let massMeeting: any = res;
      console.log("massMeeting", massMeeting);
      this.massMeeting = massMeeting.Items;
      this.rearrangeDays(this.massMeeting);
    });
  }

  rearrangeDays(massMeeting) {
    this.massMeetingMain = [];
    this.massMeetingMainWeekend = []
    for (let i = 0; i < massMeeting.length; i++) {

      if (massMeeting[i].days == 'Monday' || massMeeting[i].days == 'Tuesday' || massMeeting[i].days == 'Wednesday' || massMeeting[i].days == 'Thursday' || massMeeting[i].days == 'Friday') {
        var startTimeParsed = new Date(massMeeting[i].startTime);
        var endTimeParsed = new Date(massMeeting[i].endTime);
        console.log(startTimeParsed);
        this.massMeetingMain.push({
          "massId": massMeeting[i].massId,
          "phoneNumber": massMeeting[i].phoneNumber,
          "days": massMeeting[i].days,
          "startTime": massMeeting[i].startTime,
          "endTime": massMeeting[i].endTime,
          "startReminder": massMeeting[i].startReminder,
          "start": massMeeting[i].startReminder == true ? "ON" : "OFF",
          "endReminder": massMeeting[i].endReminder,
          "end": massMeeting[i].endReminder == true ? "ON" : "OFF",
          "startTimeParsed": { "hour": startTimeParsed.getHours(), "minute": startTimeParsed.getMinutes() },
          "endTimeParsed": { "hour": endTimeParsed.getHours(), "minute": endTimeParsed.getMinutes() }
        });
      } else if (massMeeting[i].days == 'Sunday' || massMeeting[i].days == 'Saturday') {
        var startTimeParsed = new Date(massMeeting[i].startTime);
        var endTimeParsed = new Date(massMeeting[i].endTime);
        this.massMeetingMainWeekend.push({
          "massId": massMeeting[i].massId,
          "phoneNumber": massMeeting[i].phoneNumber,
          "days": massMeeting[i].days,
          "startTime": massMeeting[i].startTime,
          "endTime": massMeeting[i].endTime,
          "startReminder": massMeeting[i].startReminder,
          "start": massMeeting[i].startReminder == true ? "ON" : "OFF",
          "endReminder": massMeeting[i].endReminder,
          "end": massMeeting[i].endReminder == true ? "ON" : "OFF",
          "startTimeParsed": { "hour": startTimeParsed.getHours(), "minute": startTimeParsed.getMinutes() },
          "endTimeParsed": { "hour": endTimeParsed.getHours(), "minute": endTimeParsed.getMinutes() }
        });
      }
    }
    this.swapDays();
    console.log("massMeetingMain ", this.massMeetingMain);
    console.log("massMeetingMainWeekend ", this.massMeetingMainWeekend);
  }


  swapDays() {
    for (let i = 0; i < this.massMeetingMain.length; i++) {
      if (this.massMeetingMain[i].days == "Monday") {
        var temp = this.massMeetingMain[0];
        this.massMeetingMain[0] = this.massMeetingMain[i];
        this.massMeetingMain[i] = temp;
      }
      if (this.massMeetingMain[i].days == "Tuesday") {
        var temp = this.massMeetingMain[1];
        this.massMeetingMain[1] = this.massMeetingMain[i];
        this.massMeetingMain[i] = temp;
      }
      if (this.massMeetingMain[i].days == "Wednesday") {
        var temp = this.massMeetingMain[2];
        this.massMeetingMain[2] = this.massMeetingMain[i];
        this.massMeetingMain[i] = temp;
      }
      if (this.massMeetingMain[i].days == "Thursday") {
        var temp = this.massMeetingMain[3];
        this.massMeetingMain[3] = this.massMeetingMain[i];
        this.massMeetingMain[i] = temp;
      }
      if (this.massMeetingMain[i].days == "Friday") {
        var temp = this.massMeetingMain[4];
        this.massMeetingMain[4] = this.massMeetingMain[i];
        this.massMeetingMain[i] = temp;
      }
    }
  }

  // setMassData(massMeeting){
  //   for(let i=0;i<massMeeting.length;i++){
  //     switch(massMeeting[i].days) {
  //       case "monday":
  //         // code block
  //         this.mondayData = massMeeting[i];
  //         break;
  //       case "tuesday":
  //         // code block
  //         this.tuesdayData = massMeeting[i];
  //         break;
  //         case "wednesday":
  //         // code block
  //         this.wednesdayData = massMeeting[i];
  //         break;
  //         case "thursday":
  //         // code block
  //         this.thursdayData = massMeeting[i];
  //         break;
  //         case "friday":
  //         // code block
  //         this.fridayData = massMeeting[i];
  //         break;
  //       default:
  //         // code block
  //     }
  //   }
  // }

  setDropdownVal(time) {
    for (let i = 0; i < this.timeSlots.length; i++) {
      if (this.timeSlots[i].value == time) {
        return this.timeSlots[i].time;
      }
    }
  }

  updateDays(mass) {
    let startDateTime = new Date();
    startDateTime.setHours(mass.startTimeParsed.hour);
    startDateTime.setMinutes(mass.startTimeParsed.minute);
    let endDateTime = new Date();
    endDateTime.setHours(mass.endTimeParsed.hour);
    endDateTime.setMinutes(mass.endTimeParsed.minute);
    let data: any = {
      "massId": mass.massId,
      "startTime": startDateTime.getTime(),
      "phoneNumber": mass.phoneNumber,
      "endReminder": mass.endReminder,
      "endTime": endDateTime.getTime(),
      "startReminder": mass.startReminder,
      "days": mass.days
    };
    // if(this.startTime){data.startTime = this.startTime;}
    if (this.startReminder != mass.startReminder) { data.startReminder = this.startReminder; }
    // if(this.endTime){data.endTime = this.endTime;}
    if (this.endReminder != mass.endReminder) { data.endReminder = this.endReminder; }
    console.log("data", data);
    this._servicesService.updateMassMeeting(data).subscribe(res => {
      console.log("update mass ", res);
      let massMeeting: any = res;
      this.massMeeting = massMeeting.Items;
      this.rearrangeDays(this.massMeeting);
      this.toastr.success('SUCCESS', 'Mass Timing updated successfully');
    });
  }

  updateValues(value, field) {
    console.log(value);
    if (field == "startTime") {
      this.startTime = value;
    } else if (field == "endTime") {
      this.endTime = value;
    } else if (field == "startReminder") {
      value == true ? (this.startReminder = false) : (this.startReminder = true);
    } else if (field == "endReminder") {
      value == true ? (this.endReminder = false) : (this.endReminder = true);
    }
    console.log(this.startReminder);
  }

  updateEvent(mass) {
    let startDateTime = new Date();
    startDateTime.setHours(mass.startTimeParsed.hour);
    startDateTime.setMinutes(mass.startTimeParsed.minute);
    let data: any = {
      "eventId": mass.eventId,
      "startTime": startDateTime.getTime(),
      "phoneNumber": mass.phoneNumber,
      "startReminder": mass.startReminder,
      "eventName": mass.days
    };
    // if(this.startTime){data.startTime = this.startTime;}
    if (this.startReminder != mass.startReminder) { data.startReminder = this.startReminder; }
    // if(this.endTime){data.endTime = this.endTime;}
    console.log("data", data);
    this._servicesService.updateEventMassMeeting(data).subscribe(res => {
      console.log("update mass ", res);
      let massMeeting: any = res;
      this.massMeeting = massMeeting.Items;
      this.rearrangeDays(this.massMeeting);
      this.toastr.success('SUCCESS', 'Mass Timing updated successfully');
    });
  }
  //monday slot process start here
  updateMonday() {
    if (!this.mondayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.mondayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.mondayStartTime.hour + ":" + this.mondayStartTime.minute + ":00").toString(),
        end_time: (this.mondayEndTime.hour + ":" + this.mondayEndTime.minute + ":00").toString(),
        notification: this.mondayStartReminder,
        day: "monday"
      }

      var arr = this.mondaySlotList
      arr.push(slot);
      console.log(this.mondaySlotList);
      this.mondayStartTime = null
      this.mondayEndTime = null
      this.mondayStartReminder = false
    }
  }

  mondayRemainder(value, field) {
    console.log(value);
    this.mondayStartReminder = value
  }
  mondayEditSlot(i, slot) {
    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.mondayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.mondayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    console.log(parseInt(Start[0]))
    // this.mondayEndTime.hour = +End[0]
    // this.mondayEndTime.minute = +End[1]
    this.mondayStartReminder = slot.notification

    var returnArray = this.mondaySlotList

    returnArray.splice(i, 1);
    this.mondaySlotList = returnArray
  }
  //monday slot process end here     


  //tuesday slot process start here
  updateTuesday() {
    if (!this.tuesdayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.tuesdayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.tuesdayStartTime.hour + ":" + this.tuesdayStartTime.minute + ":00").toString(),
        end_time: (this.tuesdayEndTime.hour + ":" + this.tuesdayEndTime.minute + ":00").toString(),
        notification: this.tuesdayStartReminder,
        day: "tuesday"
      }

      var arr = this.tuesdaySlotList
      arr.push(slot);
      console.log(this.tuesdaySlotList);
      this.tuesdayStartTime = null
      this.tuesdayEndTime = null
      this.tuesdayStartReminder = false
    }

  }

  tuesdayRemainder(value, field) {
    console.log(value);
    this.tuesdayStartReminder = value
  }
  tuesdayEditSlot(i, slot) {
    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)



    this.tuesdayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.tuesdayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.tuesdayStartReminder = slot.notification

    var returnArray = this.tuesdaySlotList

    returnArray.splice(i, 1);
    this.tuesdaySlotList = returnArray
  }
  //thesday slot process end here   


  //wednesday slot process start here
  updateWednesday() {
    if (!this.wednesdayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.wednesdayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.wednesdayStartTime.hour + ":" + this.wednesdayStartTime.minute + ":00").toString(),
        end_time: (this.wednesdayEndTime.hour + ":" + this.wednesdayEndTime.minute + ":00").toString(),
        notification: this.wednesdayStartReminder,
        day: "wednesday"
      }

      var arr = this.wednesdaySlotList
      arr.push(slot);
      console.log(this.wednesdaySlotList);
      this.wednesdayStartTime = null
      this.wednesdayEndTime = null
      this.wednesdayStartReminder = false

    }
  }

  wednesdayRemainder(value, field) {
    console.log(value);
    this.wednesdayStartReminder = value
  }
  wednesdayEditSlot(i, slot) {
    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.wednesdayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.wednesdayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.wednesdayStartReminder = slot.notification

    var returnArray = this.wednesdaySlotList

    returnArray.splice(i, 1);
    this.wednesdaySlotList = returnArray
  }
  //wednesday slot process end here  

  //thursday slot process start here
  updateThursday() {
    if (!this.thursdayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.thursdayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.thursdayStartTime.hour + ":" + this.thursdayStartTime.minute + ":00").toString(),
        end_time: (this.thursdayEndTime.hour + ":" + this.thursdayEndTime.minute + ":00").toString(),
        notification: this.thursdayStartReminder,
        day: "thursday"
      }

      var arr = this.thursdaySlotList
      arr.push(slot);
      console.log(this.thursdaySlotList);
      this.thursdayStartTime = null
      this.thursdayEndTime = null
      this.thursdayStartReminder = false

    }
  }

  thursdayRemainder(value, field) {
    console.log(value);
    this.thursdayStartReminder = value
  }
  thursdayEditSlot(i, slot) {

    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.thursdayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.thursdayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.thursdayStartReminder = slot.notification

    var returnArray = this.thursdaySlotList

    returnArray.splice(i, 1);
    this.thursdaySlotList = returnArray
  }
  //thursday slot process end here  

  //friday slot process start here
  updateFriday() {
    if (!this.fridayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.fridayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.fridayStartTime.hour + ":" + this.fridayStartTime.minute + ":00").toString(),
        end_time: (this.fridayEndTime.hour + ":" + this.fridayEndTime.minute + ":00").toString(),
        notification: this.fridayStartReminder,
        day: "friday"
      }

      var arr = this.fridaySlotList
      arr.push(slot);
      console.log(this.fridaySlotList);
      this.fridayStartTime = null
      this.fridayEndTime = null
      this.fridayStartReminder = false

    }
  }

  fridayRemainder(value, field) {
    console.log(value);
    this.fridayStartReminder = value
  }
  fridayEditSlot(i, slot) {

    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.fridayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.fridayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.fridayStartReminder = slot.notification

    var returnArray = this.fridaySlotList

    returnArray.splice(i, 1);
    this.fridaySlotList = returnArray
  }
  //friday slot process end here 


  //saturday slot process start here
  updateSaturday() {
    if (!this.saturdayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.saturdayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.saturdayStartTime.hour + ":" + this.saturdayStartTime.minute + ":00").toString(),
        end_time: (this.saturdayEndTime.hour + ":" + this.saturdayEndTime.minute + ":00").toString(),
        notification: this.saturdayStartReminder,
        day: "saturday"
      }

      var arr = this.saturdaySlotList
      arr.push(slot);
      console.log(this.saturdaySlotList);
      this.saturdayStartTime = null
      this.saturdayEndTime = null
      this.saturdayStartReminder = false
    }

  }

  saturdayRemainder(value, field) {
    console.log(value);
    this.saturdayStartReminder = value
  }
  saturdayEditSlot(i, slot) {

    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.saturdayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.saturdayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.saturdayStartReminder = slot.notification

    var returnArray = this.saturdaySlotList

    returnArray.splice(i, 1);
    this.saturdaySlotList = returnArray
  }
  //saturday slot process end here   


  //sunday slot process start here
  updateSunday() {
    if (!this.sundayStartTime) {
      this.toastr.error('ERROR', 'Fill Start time');
    } else if (!this.sundayEndTime) {
      this.toastr.error('ERROR', 'Fill End time');
    } else {
      var slot = {
        start_time: (this.sundayStartTime.hour + ":" + this.sundayStartTime.minute + ":00").toString(),
        end_time: (this.sundayEndTime.hour + ":" + this.sundayEndTime.minute + ":00").toString(),
        notification: this.sundayStartReminder,
        day: "sunday"
      }

      var arr = this.sundaySlotList
      arr.push(slot);
      console.log(this.sundaySlotList);
      this.sundayStartTime = null
      this.sundayEndTime = null
      this.sundayStartReminder = false
    }

  }

  sundayRemainder(value, field) {
    console.log(value);
    this.sundayStartReminder = value
  }
  sundayEditSlot(i, slot) {

    console.log(slot)
    var Start = slot.start_time.split(':')
    console.log(Start)
    var End = slot.end_time.split(':')
    console.log(End)

    this.sundayStartTime = { hour: parseInt(Start[0]), minute: parseInt(Start[1]) };
    this.sundayEndTime = { hour: parseInt(End[0]), minute: parseInt(End[1]) };
    this.sundayStartReminder = slot.notification

    var returnArray = this.sundaySlotList

    returnArray.splice(i, 1);
    this.sundaySlotList = returnArray
  }

  //sunday slot process end here   
  getTiming() {
    this._servicesService.get("massTimingList")
      .subscribe(res => {
        console.log(res)
        let data: any = res
      }, error => {
        console.log("error", error)
      })
  }

  update() {
    let body = {
      monday: this.mondaySlotList,
      tuesday: this.tuesdaySlotList,
      wednesday: this.wednesdaySlotList,
      thursday: this.thursdaySlotList,
      friday: this.fridaySlotList,
      saturday: this.saturdaySlotList,
      sunday: this.sundaySlotList
    }
    this._servicesService.post("createMassTiming", body).subscribe(res => {
      let data: any = res;

      this.toastr.success('', data.message);
    });

    // console.log(body)
  }



}
