import { Component, OnInit, NgZone } from '@angular/core';
import { ServicesService } from '../services.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
declare const $: any;


@Component({
  selector: 'app-classifield',
  templateUrl: './classifield.component.html',
  styleUrls: ['./classifield.component.css']
})
export class ClassifieldComponent implements OnInit {
  businessType:any;
  business:any;
  max:any = 888888888;
  min:any = 23546;
  name:any;
  phoneNumber:any;
  selectedBusinessType:any;
  createBusinessFlag:boolean = false;
  fileName:any;
  bannerFile: File;
  fileExt: any;
  photoFilename: any;
  classifieldsList:any = "";
  businessTypeValue:any = "SELECT BUSINESS";
  userNumber:any = "";
  userRole:any = "";
  isEdit:boolean=false
  isCreate:boolean=false
  isView:boolean=false
  modelTitle :any ="Create" 
  search:any
  businessId:any
  baseUrl=this._servicesService.baseURL1

  loading: boolean = false;
  constructor(private toastr: ToastrService,private _servicesService : ServicesService,private zone:NgZone) { }

  ngOnInit(): void {
    this.userNumber = this._servicesService.getUsernumber();
    this.userRole = this._servicesService.getUserRole();
    // this.getBusinessType();
    this.getClassifields();
    this.businessTypeValueChange("")
  }

   
  openModal(){
    this.isCreate=true
    this.isEdit=false
    this.isView=false
    this.modelTitle="Create"
    this.businessTypeValue =""
    this.name=""
    this.phoneNumber=""
    this.bannerFile=null
    this.fileName=""
    $('#addUser').modal('show');
    this.createBusinessFlag=false
  }

  closeModal(){
    $('#addUser').modal('hide');
  }
  

  setBusinessFlag(){
    this.createBusinessFlag ? this.createBusinessFlag = false : this.createBusinessFlag = true; 
    console.log("createBusinessFlag",this.createBusinessFlag);
  }

  createBusiness(){
    let body =  {
          "businessName" : this.business
        };
        if(!this.business){
          this.toastr.error('', "Fill the Business Type");
        }else{
          this.loading=true
          this._servicesService.post("createBusinessType",body).subscribe(res=> {
            console.log("business type",res);
            let types:any = res;
              if(types.success){
                this.setBusinessFlag();
                this.toastr.success('SUCCESS', types.message);
                this.businessTypeValueChange("")
                this.loading=false
              }else{
                this.toastr.error('', types.message);
                this.loading=false
              }
          }, err=>{
            this.toastr.error('', "Try Again Later");
            this.loading=false 
            // this.createBusinessFlag=false
           }
          );
        }
     
  //   let id = Math.floor(Math.random() * (environment.max - environment.min + 1) + environment.min);
  //   console.log("id",id);
  //   let data = {
  //     "businessId" : JSON.stringify(id),
  //     "businessType" : this.business
  //   };
  //   this._servicesService.createBusinessType(data).subscribe(res=> {
  //     console.log("business type",res);
  //     let types:any = res;
  //     this.zone.run(() => {
  //       this.setBusinessFlag();
  //       this.businessType = types.Items; 
  //     });
  //     this.toastr.success('SUCCESS', 'Business successfully created');
  //   });
  }

  // async getBusinessType(){
  //   await this._servicesService.getBusinessType().subscribe(res=>{
  //     let data:any = res;
  //     this.businessType = data.Items;
  //     console.log("business",JSON.stringify(this.businessType));
  //   });
  // }

  onSelectFile(event) {
    // alert();
      if (event.target.files && event.target.files[0]) {
        this.bannerFile = event.target.files[0];
        console.log("event.target.files[0]",event.target.files[0]);
        this.fileName = event.target.files[0].name;
        this.fileExt = event.target.files[0].type;
        // var reader = new FileReader();
        // reader.readAsDataURL(event.target.files[0]); 
        // reader.onload = (event) => { 
        //   this.url = event.target.result;
        // }
      }
  }

  businessTypeValueChange(e){
     console.log(e)
     this._servicesService.getQuery('businessTypeList?search=',e).subscribe(res => {
      console.log(res)
      let respObj: any;
      respObj = res;
      console.log(respObj.content);
      this.businessType= respObj.content
  
   });
  }


  uploadBanner(form:NgForm){
    let formData: FormData = new FormData();
   if(!this.name){
    this.toastr.error('', 'Please fill Name');
   } else if(!this.phoneNumber){
    this.toastr.error('', 'Please fill Content');
   } else if(!this.bannerFile){
    this.toastr.error('', 'Please Upload File');
   } else if(!this.businessTypeValue){
    this.toastr.error('', 'Please Select Business Type');
   } else{
    // formData.append('businessName',this.name)
    // formData.append('phoneNumber',this.phoneNumber)
    this.loading=true
    formData.append('file', this.bannerFile);
    // formData.append('businessTypeId ', this.businessTypeValue);
    this._servicesService.postQueryFormdata("createClassifier?businessName="+this.name+"&businessTypeId="+this.businessId+"&phoneNumber="+this.phoneNumber,formData).subscribe(res => {
      console.log(res)
      let respObj: any;
      respObj = res;
      console.log(respObj);
      if(respObj.success){
        this.getClassifields()
        $('#addUser').modal('hide');
        this.toastr.success('', respObj.message);
        this.loading=false
        this.bannerFile=null

      }else{
        this.toastr.error('', respObj.message);
        this.loading=false
      }
  
   }, err=>{
     if(err.status == 400){
      this.toastr.error('', "Business Type Select from list or Create and select it");
      this.loading=false 
     }else{
      this.toastr.error('', "Try Again Later");
      this.loading=false 
     }
  
  }
  );
   }
  
  }
  // async uploadBanner(){
  //   await this._servicesService.getPresignedUrl(this.fileName,this.fileExt).subscribe( async URL =>{
  //     let preSignedURL:any = URL;
  //     this.photoFilename = preSignedURL.photoFilename;
  //     console.log("preSignedURL",preSignedURL);
  //     await this._servicesService.putImageToS3(preSignedURL.uploadURL,this.bannerFile).subscribe(async res =>{
  //       let imgData:any = res;
  //       console.log("imgData",imgData);
  //       await this.putAnnounceData(this.photoFilename);
  //     });
  //   });
  // }


  putAnnounceData(photoFilename){
    let id = Math.floor(Math.random() * (environment.max - environment.min + 1) + environment.min);
    let data = {
      "classifieldId": JSON.stringify(id),
      "phoneNumber" : this.phoneNumber,
      "endpoint" : `https://assets-barnabas-v2.s3.us-east-1.amazonaws.com/${photoFilename}`,
      "userName" : this.name,
      "businessType" : this.businessTypeValue
    }
    this._servicesService.storeClassifields(data).subscribe(res =>{
      console.log("storeBannerData",res);
      this.getClassifields();
      this.closeModal();
      this.toastr.success('SUCCESS', 'Classifield created successfully');
    });
  }

  // getClassifields(){
  //   this._servicesService.getClassifields().subscribe(res=>{
  //     let data:any = res;
  //     this.classifieldsList = data.Items;
  //     console.log("classifieldsList",this.classifieldsList.length);
  //   })
  // }

  
  getClassifields(){
    this._servicesService.get("classifiedList").subscribe(res=>{
      let data:any = res;
      console.log(data)
      this.classifieldsList = data.content;
      console.log("classifieldsList",this.classifieldsList.length);
    })
  }

  // deleteClassifields(id){
  //   this._servicesService.deleteClassifields(id).subscribe(res=>{
  //     let data:any = res;
  //     this.getClassifields();
  //     this.toastr.success('SUCCESS', 'Classifield deleted successfully');
  //   })
  // }
  deleteClassifields(data){
    this._servicesService.postQuery("deleteClassifier?classifierId=",data.id).subscribe(res => {
      let respObj: any;
      respObj = res;
      console.log(respObj);
      if(respObj.success){
        this.getClassifields()
        this.toastr.success('', respObj.message);
      
      }else{
        this.toastr.error('', respObj.message);
      }
 }, err => {
  // console.log(err)
  this.toastr.error('', "Try Again Later");
  this.loading=false
},
);
  }
  editClassifields(data){
    $('#addUser').modal('show');
    this.isEdit =true
    this.isCreate = false
    this.isView=false
    this.modelTitle = "Edit"
    console.log(data)
     this.phoneNumber= data.phoneNumber
     this.businessTypeValue = data.businessType
     this.name = data.userName
   
  }

  viewClassifields(data){
    $('#addUser').modal('show');
    this.modelTitle = "VIew"
    this.isView=true
    this.isEdit =false
    this.isCreate = false
    console.log(data)
     this.phoneNumber= data.phoneNumber
     this.businessTypeValue = data.businessType
     this.name = data.userName
  }

  update(){
    let body ={
      businessType : this.businessTypeValue,
      name : this.name,
      phoneNumber : this.phoneNumber
    }
    
    console.log(body)
  }

  businessTypeChange(){
    console.log("business",this.businessTypeValue);
  }

  changeVal(val){
    this.businessTypeValue = val.businessName;
    this.businessId=val.businessId
    // console.log(val)
  }
}
