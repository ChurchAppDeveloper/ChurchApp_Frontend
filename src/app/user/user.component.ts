import { Component, OnInit, NgZone } from '@angular/core';
import { ServicesService } from '../services.service';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from "@angular/forms";
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';


declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  passwordField:boolean=true
  passwordType:any="password"
  visible:boolean=true
  temp:any=""
  role:any = "Role";
  currentUser:any;
  phoneNumber:any = "";
  password:any;
  userList:Array<any> = [];
  roleList: any = ['Admin', 'Contributor'];
  updateRole: any = "";
  updateRoleFlag: boolean = false;
  updateBtn:any = "";
  userNumber:any = "";
  userRole:any = "";
  userForm = new FormGroup({
    phoneNumber: new FormControl() ,
    userRole: new FormControl(),
    userId: new FormControl()
  });
  isCreate:boolean=false
  isView:boolean=false
  isEdit:boolean=false
  modelTitle :any ="ADDING" 

  userName:any="";
  userID:any="";
  userEmail:any="";
  userContactNo:any="";
  userRoleName:any="";
  userAddress:any=""

  // Reactive form code starts
  usersForm: any;
  loading: boolean = false;
  items: FormArray;

  activeStatus: boolean = true;
  // Reactive form code ends


  constructor(private zone:NgZone,private toastr: ToastrService,private _servicesService : ServicesService,public fb: FormBuilder) { }


  roleListForm = this.fb.group({
    name: ['']
  })

  onSubmit() {
    alert(JSON.stringify(this.roleListForm.value))
  }

  // Reactive form code starts
  createItem(): FormGroup {
    return this.fb.group({
      phoneNumber: '',
      role: ''
    });
  }

  // addItem(): void {
  //   this.items = this.usersForm.get('items') as FormArray;
  //   this.items.push(this.createItem());
  // }

  updateItem(val): void {
    this.updateBtn = val.value.phoneNumber;
    // this.updateRoleFlag = true;
    console.log(val);
    this.updateRole = val.value.role;
  }
  // Reactive form code ends

  getUsers(){
    this._servicesService.get("userList").subscribe(res => {
      let respObj: any;
      console.log(res)
      respObj = res
      this.userList = respObj.content;
      this.pushDataToForm(this.userList);
      console.log("res",this.usersForm.get('items'));
    }, error => {
      console.log("error",error);
    }
      // respObj = res;

 
);
  }

  ngOnInit(): void {
    this.getUsers();
    this.userNumber = this._servicesService.getUsernumber();
    this.userRole = this._servicesService.getUserRole();
    // Reactive form code starts
    this.usersForm = this.fb.group({
      items: this.fb.array([])
    });

    this.items = this.usersForm.get('items') as FormArray;
    
  //  this._servicesService.userNumber.subscribe( userNumber => {
  //    console.log("user page userNumber",userNumber);
  //    this.currentUser.phoneNumber = userNumber;
  //  });

  //  this._servicesService.userRole.subscribe( userRole => {
  //   console.log("user page userRole",userRole);
  //   this.currentUser.userRole = userRole;
  // });

    // this.getUserData();
  }

  getUserData(){
    this._servicesService.getUser().subscribe(res => {
      let data:any = res; 
      console.log(res)
      this.userList = data.Items;
      this.pushDataToForm(this.userList);
      console.log("res",this.usersForm.get('items'));
    }, error => {
      console.log("error",error);
    });
  }

  pushDataToForm(userData){
    console.log("before reset",this.usersForm);
    this.items.clear();
    console.log("after reset",this.usersForm);
    for(let i = 0 ; i < userData.length ; i++){
      this.items.push(this.fb.group({
          phoneNumber: userData[i].phoneNumber,
          role: [{value: userData[i].userRole, disabled: this.userRole == 'Contributor' ? true : false}],
          userId: userData[i].userId,
        })); 
    }
  }

  roleSelection(roleSelected){
    this.role = roleSelected;
  }

  addUser(form:NgForm){

    let body :any
    if(!this.password){
      body = {
        address: this.userAddress,
        contactNo: this.phoneNumber,
        email: this.userEmail,
        name: this.userName,
        // roleName: this.role,
      
      }
    }else{
        body = {
        address: this.userAddress,
        contactNo: this.phoneNumber,
        email: this.userEmail,
        name: this.userName,
        // roleName: this.role,
        password:this.password
      }
    }
    if(!this.phoneNumber){
      this.toastr.error('','Enter Phone Number')
    }else{
      if(!this.password){
        this.toastr.error('','Enter Password')
      }else{
        console.log(body)
        this.loading = true
        this._servicesService.post("createUser",body).subscribe(res=> {
         
          console.log("user update",res);
          let types:any = res;
          if(types.success){
            this.getUsers();
            this.toastr.success('SUCCESS', types.message);
            $('#addUser').modal('hide');
            this.loading = false
            this.password=""
            this.phoneNumber=""
          
            this.activeStatus=true
          }else{
            this.toastr.error('', types.message);
            this.loading = false
          }
        
      
        }, err=>{
            // console.log(err)
            this.toastr.error('', "Try Again Later");
            this.loading = false
        
        });
      }
    
    }
    // let id = Math.floor(Math.random() * (environment.max - environment.min + 1) + environment.min);
    // let requestData = {
    //   "userId" : JSON.stringify(id),
    //   "phoneNumber" : "91"+JSON.stringify(this.phoneNumber),
    //   "userRole" : this.role
    // };
    // if(this.role && this.phoneNumber){
    //   this._servicesService.addUser(requestData).subscribe(res => {
    //     let data:any = res;
    //     if (data.Items.length > 0) {
    //       this.userList = data.Items;
    //       this.pushDataToForm(this.userList);
    //       this.closeModal();
    //       this.toastr.success('SUCCESS', 'User added successfully');
    //       console.log("res",res);
    //     } else {
          
    //     }
  
    //   }, error => {
    //     this.toastr.error('ERROR', error.error);
    //     console.log("error",error);
    //   });
    // }else{
    //   alert("mandatory");
    // }
  }

  deleteUser(data){
    console.log(data)
    this._servicesService.postQuery("deleteUser?userId=", data.id).subscribe(res => {
      let respObj: any;
      respObj = res;
      console.log(respObj);
            if (respObj.success) {
              this.getUsers()
              this.toastr.success('', respObj.message);

            } else {
              this.toastr.error('', respObj.message);
            }
          }, err => {
            // console.log(err)
            this.toastr.error('', "Try Again Later");
            },
    );

    // console.log("deleteUser",phoneNumber);
    // this._servicesService.deleteUser(phoneNumber).subscribe(res => {
    //   let user:any = res;
    //   this.userList = user.Items;
    //   console.log("delete user",this.userForm);
    //   this.pushDataToForm(this.userList);
    //   this.toastr.success('SUCCESS', 'User deleted successfully');
    //   console.log("this.userList",JSON.stringify(this.userList));
    // })
  }

  changeStatus(e){
    console.log(e)
    this.activeStatus = e
  }
  updateUserData(data){
    console.log(data)
    $('#addUser').modal('show');
    this.modelTitle="EDIT"
    this.isView=true
    this.isCreate=false
    this.isEdit=true
    this.phoneNumber=data.contactNo
    this.role=data.roleName
    this.userEmail=data.email
    this.userName=data.name
    this.userID=data.id
    this.userAddress = data.address
    this.activeStatus = data.activeStatus
    if(this.userNumber == this.phoneNumber){
         console.log("current user")
         this.passwordField=true
    }else{
      console.log("other")
      this.passwordField=false
    }

  
    
  }

  openModal(){
    this.isCreate=true
    this.isView=false
    this.isEdit=false
    this.password=""
    this.modelTitle="ADDING"
    this.phoneNumber=""
    this.role=""
    this.passwordField=true
    this.activeStatus=true
    $('#addUser').modal('show');
  }

  closeModal(){
    $('#addUser').modal('hide');
  }

  edit(){
    let body :any
    if(!this.password){
      body = {
        address: this.userAddress,
        contactNo: this.phoneNumber,
        email: this.userEmail,
        id: this.userID,
        name: this.userName,
        // roleName: this.role,
        activeStatus:this.activeStatus
      }
    }else{
        body = {
        address: this.userAddress,
        contactNo: this.phoneNumber,
        email: this.userEmail,
        id: this.userID,
        name: this.userName,
        // roleName: this.role,
        password:this.password,
        activeStatus:this.activeStatus
      }
    }

    if(!this.phoneNumber){
      this.toastr.error('','Enter Phone Number')
    }else{
      if(!this.password && this.userNumber == this.phoneNumber){
        this.toastr.error('','Enter Password')
      }else{
        console.log(body)
        this.loading=true
        this._servicesService.post("updateUser",body).subscribe(res=> {
          
          console.log("user update",res);
          let types:any = res;
          if(types.success){
            this.getUsers();
            this.toastr.success('SUCCESS', types.message);
            $('#addUser').modal('hide');
            this.loading = false
            this.password=""
            this.activeStatus=true
          }else{
            this.toastr.error('', types.message);
            this.loading = false
          }

          // let types:any = res;
       
          //   this.getUsers();
         
          // this.toastr.success('SUCCESS', types.message);
          // $('#addUser').modal('hide');
        }, err=>{
          // console.log(err)
          this.toastr.error('', "Try Again Later");
          this.loading = false
      
      });
    }
  }
  }
 
  

  viewUser(data){
    $('#addUser').modal('show');
    this.modelTitle="VIEW"
    this.isView=true
    this.isCreate=false
    this.phoneNumber=data.phoneNumber
    this.role=data.role
  console.log(data)
    
   
  }

  updateUser(selectedUser){
    console.log("selectedUser",selectedUser.value.phoneNumber,"  ",this.updateRole);
    let data = {
      "userId": selectedUser.value.userId,
      "phoneNumber" : selectedUser.value.phoneNumber,
      "userRole" : this.updateRole
    }
    this._servicesService.updateUser(data).subscribe(res => {
      let user:any = res;
      this.userList = user.Items;
      this.updateBtn = "";
      this.pushDataToForm(this.userList);
      this.toastr.success('SUCCESS', 'User updated successfully');
      console.log("this.userList",JSON.stringify(this.userList));
    })
  }
  
 

  changeSuit(e,i) {
    this.updateRoleFlag = true;
    this.roleListForm.get('name').setValue(e.target.value, {
       onlySelf: true
    });
    this.updateRole = e.target.value
    console.log("updateRole",this.updateRole);
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
