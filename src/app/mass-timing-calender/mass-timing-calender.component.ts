import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
// import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  // CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDayViewBeforeRenderEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { ToastrService } from 'ngx-toastr';
import { ServicesService } from '../services.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import RRule from 'rrule';
// import { Moment } from 'moment-timezone';
import * as moment from 'moment-timezone';
import { ViewPeriod } from 'calendar-utils';
import { Router, ActivatedRoute } from "@angular/router";

export interface CalendarEvent<MetaType = any> {
  id?: string | number;
  start: Date;
  end?: Date;
  title: string;
  color?: any;
  actions?: any;
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
      beforeStart?: boolean;
      afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: MetaType;
  start_time?:any;
  end_time?:any;
}

interface RecurringEvent {
  title: string;
  color: any;
  id:any;
  start:any;
  end:any;
  actions:any;
  allDay: boolean;
  resizable: {
    beforeStart: boolean,
    afterEnd: boolean,
  },
  draggable: boolean,
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
  start_time:any;
  end_time:any;
}
declare const $: any;
const colors: any = {
  red: {
    primary: '#fc2e53',
    secondary: '#FAE7EA',
  },
  yellow: {
    primary: '#ED8627',
    secondary: '#faddc2',
  },
  blue: {
    primary: '#BC2DFF',
    secondary: '#efd5fb',
  },
  
  green: {
    primary: '#6aee36',
    secondary: '#a5ebb4',
  },
};



moment.tz.setDefault('Utc');
@Component({
  selector: 'app-mass-timing-calender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mass-timing-calender.component.html',
  styleUrls: ['./mass-timing-calender.component.css']
})
export class MassTimingCalenderComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('close') close: ElementRef;
  
 //for display 
  selectedDateDetail :Date = new Date()
  selectedEventsDisplay :any =[]

  view: CalendarView = CalendarView.Day;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  viewPeriod: ViewPeriod;

  recurringEvents: RecurringEvent[] = [ ];

  screenVisible:boolean

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  id:any;
  selectedDate:any;
  startDate:any;
  endDate:any;
  eventOption:Array<any> = [
    {name:"Mass Timing"},
    {name:"Eucharistic"},
    {name:"Rosary"},new Date("2021-10-27")
  ]
  eventStartTime:any;
  eventEndTime:any;
  eventType:any;
  primaryColor:any;
  secondaryColor:any;
  today :any;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i>Delete</i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.deleteEventDetail(event)
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'Endudfdf',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'Rosary',
  //     color: colors.yellow,
  //     actions: this.actions,
  //   },
  //   {
  //     start: new Date("2021-10-25"),
  //     end: new Date("2021-10-27"),
  //     title: 'Euchaisic',
  //     color: colors.green,
  //     allDay: true,
  //   },
  //   {

  //     start: addHours(startOfDay(new Date()), 2),
  //     end: addHours(new Date(), 2),
  //     title: 'Mass Timing',
  //     color: colors.blue,
  //     actions: this.actions,

  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private toastr: ToastrService, private _servicesService: ServicesService,private cdr: ChangeDetectorRef, private router:Router) { }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("date clicked",events)
    this.selectedDateDetail = date
    this.selectedEventsDisplay = events
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
 addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event)
    this.startDate = event.start.getFullYear()+"-"+this.addZero(event.start.getMonth()+1)+"-"+this.addZero(event.start.getDate())
    this.endDate = event.end.getFullYear()+"-"+this.addZero(event.end.getMonth()+1)+"-"+this.addZero(event.end.getDate())
    this.eventType = event.title
    this.primaryColor = event.color.primary
    this.secondaryColor = event.color.secondary
    this.eventStartTime = this.addZero(event.start_time.getHours()) +":"+this.addZero(event.start_time.getMinutes())
    this.eventEndTime = this.addZero(event.end_time.getHours()) +":"+this.addZero(event.end_time.getMinutes())
    this.id = event.id
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'sm' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getTiming() {
    console.log('1,2,3')
    // this.recurringEvents = [
    //   {
    //         start: "07:00:00",
    //         end: "2021-06-13 08:00:00",
    //         title: "new",
    //         id:2,
    //         color: colors.red,
    //         actions: this.actions,
    //         allDay: true,
    //         resizable: {
    //           beforeStart: true,
    //           afterEnd: true,
    //         },
    //         draggable: true,
    //         rrule: {
    //           freq: RRule.WEEKLY,
    //           byweekday: [1],
    //         },
    //       },
    //       {
    //         start: "07:00:00",
    //         end: "2021-06-13 08:00:00",
    //         title: "new",
    //         id:2,
    //         color: colors.red,
    //         actions: this.actions,
    //         allDay: true,
    //         resizable: {
    //           beforeStart: true,
    //           afterEnd: true,
    //         },
    //         draggable: true,
    //         rrule: {
    //           freq: RRule.WEEKLY,
    //           byweekday: [5],
    //         },
    //       }

    // ]
    this._servicesService.get("massTimingList")
      .subscribe(res => {
        console.log(res)
        let data: any = res;
        // console.log(data.content.length)
        if (data.content.length > 0) {
          console.log('start-point',data.content)
          setTimeout(() => {
            let inputElement: HTMLElement = this.fileInput.nativeElement as HTMLElement;
            inputElement.click();
          }, 10);
         
          this.recurringEvents = []
          for (let i = 0; i < data.content.length; i++) {
            var coloraa 
            // if(data.content[i].schedule_type == "Eucharistic"){
            //   coloraa = colors.yellow
            // }else if(data.content[i].schedule_type == "Mass Timing"){
            //   coloraa = colors.blue
            // }else { 
            //   coloraa = colors.red
            // }
            // console.log()
            // console.log("date",data.content[i])
            // console.log("day",new Date(data.content[i].date).getDay())
            // var day :any
            // if(new Date(data.content[i].date).getDay() == 0){
            //   day = 6
            // }else{
            //   day = new Date(data.content[i].date).getDay() - 1
            // }
            // this.recurringEvents.push({
            //   start: new Date(data.content[i].start_time),
            //   start_time:data.content[i].start_time,
            //   end_time:data.content[i].end_time,
            //   end: new Date(data.content[i].end_time),
            //   title: data.content[i].schedule_type,
            //   id:data.content[i].id,
            //   color: coloraa,
            //   actions: this.actions,
            //   allDay: true,
            //   resizable: {
            //     beforeStart: true,
            //     afterEnd: true,
            //   },
            //   draggable: true,
            //   rrule: {
            //     freq: RRule.WEEKLY,
            //     byweekday: [day],
            //     },
              

            // })

            // this.recurringEvents.push({
            //   start: "07:00:00",
            //   end: "2021-06-13 08:00:00",
            //   title: data.content[i].schedule_type,
            //   id:data.content[i].id,
            //   color: colors.red,
            //   actions: this.actions,
            //   allDay: true,
            //   resizable: {
            //     beforeStart: true,
            //     afterEnd: true,
            //   },
            //   draggable: true,
            //   rrule: {
            //               freq: RRule.WEEKLY,
            //               byweekday: [5],
            //             },
            //   })

            // this.recurringEvents.push({
            //   start: "07:00:00",
            //   end: "2021-06-13 08:00:00",
            //   title: "new",
            //   id:data.content[i].id,
            //   color: colors.red,
            //   actions: this.actions,
            //   allDay: true,
            //   resizable: {
            //     beforeStart: true,
            //     afterEnd: true,
            //   },
            //   draggable: true,
            //   rrule: {
            //               freq: RRule.WEEKLY,
            //               byweekday: [5],
            //             },
            //   })

            this.events.push({
              start: new Date(data.content[i].startDate),
              end: new Date(data.content[i].endDate),
              title: data.content[i].schedule_type,
              id:data.content[i].id,
              color:{
                primary: data.content[i].primaryColour,
                secondary: data.content[i].secondaryColour,
              },
              actions: this.actions,
              allDay: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: false,
              start_time: new Date(data.content[i].start_time),
              end_time:new Date(data.content[i].end_time)
            })
          }
        }
        
      }, error => {
        console.log("error", error)
      })
     
      
  }

  ngOnInit(): void {
    var today = new Date()
    this.startDate = "2021-10-30"
    this.today = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()
    console.log(this.events)
    this.getTiming();
    // setTimeout(() => {
    //   let inputElement: HTMLElement = this.fileInput.nativeElement as HTMLElement;
    //   inputElement.click();
    // }, 2000);
    // this.getEventMeeting();
  }
  openModal(){
    this.selectedDate=""
    this.startDate=""
    this.endDate=""
    this.eventStartTime="11:00"
    this.eventEndTime="12:00"
    this.eventType=""
    $('#addUser').modal('show');
    
  }

  reload(){
let currentUrl = this.router.url
    this.router.navigateByUrl("/Navigation/Announcement", { skipLocationChange: false })
    .then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  eventAdd(form: NgForm){
    this.events=[]
    
      console.log(form.value)
      if(!form.value.startDate){
        this.toastr.error("" , "Please Select the Start Date")
      }else if(!form.value.endDate){
        this.toastr.error("" , "Please Select the End Date")
      }else if(!form.value.eventType){
        this.toastr.error("" , "Please Select the Type")
      }else if(!form.value.eventStartTime){
        this.toastr.error("" , "Please Select the Start Time")
      }else if(!form.value.eventEndTime){
        this.toastr.error("" , "Please Select the End Time")
      }else if(form.value.eventEndTime < form.value.eventStartTime){
        this.toastr.error("" , "End Time should be greater then start time")
      }else{
        console.log(form.value)
        let body={
          
          // date: form.value.selectedDate+" "+"00:00:00",
          schedule_type: form.value.eventType,
          startDate:form.value.startDate+" "+"00:00:00",
          endDate:form.value.endDate+" "+"00:00:00",
          start_time   : form.value.startDate+" "+form.value.eventStartTime+":00",
          end_time: form.value.endDate+" "+form.value.eventEndTime+":00",
          primaryColour: form.value.primaryColor,
          secondaryColour: form.value.secondaryColor
        }
        console.log(body)
        this._servicesService.post("createMassTiming", body).subscribe(res => {
          let data: any = res;
          if(data.success){
            // console.log(data)
            this.selectedDate=""
            this.eventStartTime=""
            this.eventEndTime=""
            this.eventType=""
            // this.loading = false;
            this.toastr.success('', data.message);
            this.getTiming()
            this.reload()
            $('#addUser').modal('hide');
          }else{
            this.toastr.error('', data.message);
          }
         
        }, err => {
          this.toastr.error('', 'Try Again Later');
        }
        );


      }


  }

  
  eventUpdate(form: NgForm){
    this.events=[]
    
      console.log(form.value)
      if(!form.value.startDate){
        this.toastr.error("" , "Please Select the Start Date")
      }else if(!form.value.endDate){
        this.toastr.error("" , "Please Select the End Date")
      }else if(!form.value.eventType){
        this.toastr.error("" , "Please Select the Type")
      }else if(!form.value.eventStartTime){
        this.toastr.error("" , "Please Select the Start Time")
      }else if(!form.value.eventEndTime){
        this.toastr.error("" , "Please Select the End Time")
      }else if(form.value.eventEndTime < form.value.eventStartTime){
        this.toastr.error("" , "End Time should be greater then start time")
      }else{
        console.log(form.value)
        let body={
          
          // date: form.value.selectedDate+" "+"00:00:00",
          schedule_type: form.value.eventType,
          startDate:form.value.startDate+" "+"00:00:00",
          endDate:form.value.endDate+" "+"00:00:00",
          start_time   : form.value.startDate+" "+form.value.eventStartTime+":00",
          end_time: form.value.endDate+" "+form.value.eventEndTime+":00",
          primaryColour: form.value.primaryColor,
          secondaryColour: form.value.secondaryColor
        }
        console.log(body)
        this._servicesService.post("updateMassTiming?id="+this.id, body).subscribe(res => {
          let data: any = res;
          if(data.success){
            // console.log(data)
            this.startDate=""
            this.endDate=""
            this.eventStartTime=""
            this.eventEndTime=""
            this.eventType=""
            this.primaryColor=""
            this.secondaryColor=""
            // this.loading = false;
            this.toastr.success('', data.message);
            this.getTiming()
            this.reload()
            
            let inputElement: HTMLElement = this.close.nativeElement as HTMLElement;
            inputElement.click();
            // $('#addUser').modal('hide');
            // this.modal.close()
          }else{
            this.toastr.error('', data.message);
          }
         
        }, err => {
          this.toastr.error('', 'Try Again Later');
        }
        );


      }


  }

  deleteEventDetail(data){
      this.events=[]
      console.log(data.id)
      this._servicesService.postQuery("deleteMassTiming?massTimingId=",data.id).subscribe(res => {
        console.log(res)
        let respObj: any;
        respObj = res;
        console.log(respObj);
        if(respObj.success){
          this.getTiming()
          this.reload()
          this.toastr.success('', respObj.message);
        
        }else{
          this.toastr.error('', respObj.message);
        }
   }, err => {
    // console.log(err)
    this.toastr.error('', "Try Again Later");
  },
  );
  
      
  }
  closeEdit(){
    let inputElement: HTMLElement = this.close.nativeElement as HTMLElement;
    inputElement.click();
  }
  
  // updateCalendarEvents(
  //   viewRender:
  //     | CalendarMonthViewBeforeRenderEvent
  //     | CalendarWeekViewBeforeRenderEvent
  //     | CalendarDayViewBeforeRenderEvent
  // ): void {
  //   localStorage.setItem('viewrender', JSON.stringify(viewRender))
  //   setTimeout(() => {
  //     if (
  //       !this.viewPeriod ||
  //       !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
  //       !moment(this.viewPeriod.end).isSame(viewRender.period.end)
  //     ) {
       
  //       this.viewPeriod = viewRender.period;
  //       this.events = []
  //       // console.log('event',this.events)
  //       this.recurringEvents.forEach((event) => {
  //         console.log('check-event',event)
  //         console.log('test')
  //         const rule: RRule = new RRule({
  //           ...event.rrule,
  //           dtstart: moment(viewRender.period.start).startOf('day').toDate(),
  //           until: moment(viewRender.period.end).endOf('day').toDate(),
  //         });
  //         const { title, color } = event;
         
  //         rule.all().forEach((date) => {
  //           this.events.push({
  //             title,
  //             color,
  //             // start: event.start,
  //             // end:event.end,
  //             start: moment(date).toDate(),
  //             end:moment(date).toDate(),
  //             allDay:true,
  //             actions:this.actions,
  //             id:event.id,
  //             start_time:new Date(event.start_time),
  //             end_time:new Date(event.end_time)

            

  //           });
  //           console.log( this.events)
  //         });
  //       });
  //       this.cdr.detectChanges();
  //     }
  //   }, 1200);
    
  // }
  


}