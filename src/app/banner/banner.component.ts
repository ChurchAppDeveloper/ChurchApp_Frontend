import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

declare const $: any;


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  fileUploadFlag: boolean = false;
  bannerFile: File;
  fileExt: any;
  photoFilename: any;
  bannerImageTile:any = "";
  userNumber:any = "";
  userRole:any = "";
  baseUrl=this._servicesService.baseURL1;
  loading: boolean = false;
  format:any;

  constructor(private toastr: ToastrService,private _servicesService : ServicesService) { }

  ngOnInit(): void {
    this.userNumber = this._servicesService.getUsernumber();
    this.userRole = this._servicesService.getUserRole();
    this.getBannerTile();
    console.log(this.baseUrl)
  }

  getBannerTile(){
    this._servicesService.get("bannerImageList").subscribe( res =>{
      let bannerData:any = res;
      this.bannerImageTile = bannerData.content;
      console.log("bannerImageTile",this.bannerImageTile, bannerData);
    });
  }

  // getBannerTile(){
  //   this._servicesService.getBannerTable().subscribe( res =>{
  //     let bannerData:any = res;
  //     this.bannerImageTile = bannerData.Items;
  //     console.log("bannerImageTile",this.bannerImageTile);
  //   });
  // }

  url: any;
  fileName:any;
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
          this.bannerFile = event.target.files[0];
          console.log("event.target.files[0]",event.target.files[0]);
          this.fileName = event.target.files[0].name;
          this.fileExt = event.target.files[0].type;
          var videoType = ['video/x-flv','video/mp4','application/x-mpegURL','video/MP2T','video/3gpp',
        'video/quicktime','video/x-msvideo','video/x-ms-wmv']

        console.log(videoType.includes(event.target.files[0].type), event.target.files[0].type)

          if(videoType.includes(event.target.files[0].type)){
            this.format = 'video';
          } else{
            this.format = 'image';
          }
          console.log(this.format)

          this.fileUploadFlag = true;
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]); 
          reader.onload = (event) => { 
            this.url = event.target.result;
          }
        }
    }

    removerBanner(){
      $('.file-upload-input').replaceWith($('.file-upload-input').clone());
      this.fileUploadFlag = false;
      this.fileName = "";
      this.url = "";
    }

    async uploadBanner(){
      let formData: FormData = new FormData();
      formData.append('file', this.bannerFile);
      this.loading = true;
      this._servicesService.postFormdata("uploadBannerImage",formData).subscribe(res => {
        let respObj: any;
        respObj = res;
        console.log(respObj);
        if(respObj.success){
          this.getBannerTile()
          $('#addUser').modal('hide');
          this.toastr.success('', respObj.message);
          this.loading = false
          this.fileUploadFlag = false;
          this.fileName = "";
          this.url = "";
        }
   }, err => {
      // console.log(err)
      this.toastr.error('', "Try Again Later");
      this.loading = false
    },
);
      // this._servicesService.postFormdata()
      // await this._servicesService.getPresignedUrl(this.fileName,this.fileExt).subscribe( async URL =>{
      //   let preSignedURL:any = URL;
      //   this.photoFilename = preSignedURL.photoFilename;
      //   console.log("preSignedURL",preSignedURL);
      //   await this._servicesService.putImageToS3(preSignedURL.uploadURL,this.bannerFile).subscribe(async res =>{
      //     let imgData:any = res;
      //     console.log("imgData",imgData);
      //     await this.putBannerData(this.photoFilename);
      //   });
      // });
    }

    putBannerData(photoFilename){
      let id = Math.floor(Math.random() * (environment.max - environment.min + 1) + environment.min);
      let data = {
        "bannerId" : JSON.stringify(id),
        "phoneNumber" : this.userNumber,
        "endpoint" : `https://assets-barnabas-v2.s3.us-east-1.amazonaws.com/${photoFilename}`
      }
      this._servicesService.storeBannerData(data).subscribe(res =>{
        console.log("storeBannerData",res);
        this.getBannerTile();
        this.closeModal();
        this.toastr.success('SUCCESS', 'Banner successfully uploaded');
        this.removerBanner();
      });
    }

    delete(banner){
      console.log(banner)
      var filename = banner.substring(banner.lastIndexOf('fileName=')+9)
      console.log(filename)
      this._servicesService.postQuery("deleteBannerImage?fileName=",filename).subscribe(res => {
        let respObj: any;
        respObj = res;
        console.log(respObj);
        if(respObj.success){
          this.getBannerTile()
          this.toastr.success('', respObj.message);
        
        }
   }, err => {
    // console.log(err)
    this.toastr.error('', "Try Again Later");
  },
);
      // this._servicesService.deleteBanner(banner.bannerId).subscribe(res=>{
      //   let data:any = res;
      //   this.bannerImageTile = data.Items;
      //   this.toastr.success('SUCCESS', 'Banner deleted successfully');
      // });
    }

  openModal(){
    this.fileUploadFlag = false;
    this.fileName = "";
    this.url = "";
    $('#addUser').modal('show');
  }

  closeModal(){
    $('#addUser').modal('hide');
  }

}
