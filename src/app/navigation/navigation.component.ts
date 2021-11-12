import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  currentTab:any = "";
  userNumber:any = "";
  userRole:any = "";
  constructor(private router: Router,private _servicesService : ServicesService) { }

  ngOnInit(): void {
    this.userNumber = this._servicesService.getUsernumber();
    this.userRole = this._servicesService.getUserRole();
    console.log("userNumber",this.userNumber);
    // this._servicesService.userNumber.subscribe(res=>{
    // this.phoneNumber = res;  
    // })
    switch(this.router.url){
      case "/Navigation/Mass-timing":
      this.currentTab = "mass";
      break;

      case "/Navigation/Banner":
      this.currentTab = "banner";
      break;

      case "/Navigation/Announcement":
      this.currentTab = "announcement";
      break;

      case "/Navigation/Confession":
      this.currentTab = "confession";
      break;

      case "/Navigation/Classifield":
      this.currentTab = "classifield";
      break;

      case "/Navigation/User":
      this.currentTab = "user";
      break;

      default:
        break;
    }
  }

  setActiveTaab(val){
    this.currentTab = val;
    if(val == "logout"){
      localStorage.removeItem("user");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");
      // localStorage.removeItem("userNumber");
      this.router.navigate(['/']);
    }
  }

}
