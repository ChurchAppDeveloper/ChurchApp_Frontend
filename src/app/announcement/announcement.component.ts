import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicesService } from '../services.service';
import { environment } from '../../environments/environment';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import {} from '../../assets/images'

declare const $: any;


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  @ViewChild('upload')
  img: string
  urlSafe: SafeResourceUrl;
  fileUrl : any;
  fileUploadFlag: boolean = false;
  myInputVariable: ElementRef;
  announcementData: Array<any> = [];
  announceTitle: any;
  announceContent: any;
  url: any;
  fileName: any;
  bannerFile=null;
  fileExt: any;
  photoFilename: any;
  userNumber: any = "";
  userRole: any = "";
  isEdit: boolean = false
  isCreate: boolean = false
  isView: boolean = false
  modelTitle: any = "CREATE"
  search: any
  id: any
  loading: boolean = false;
  format:any;
  getUrl : any
  image_mimetype: boolean = false;
  video_mimetype: boolean = false;
  document_mimetype:boolean = false;
  // urlSafe:any;
  constructor(private toastr: ToastrService, private _servicesService: ServicesService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.userNumber = this._servicesService.getUsernumber();
    this.userRole = this._servicesService.getUserRole();
    this.getAnnouncement();
  }

  getAnnouncement() {
    this._servicesService.get('getAnnouncementList').subscribe(res => {
      let data: any = res;
      this.announcementData = data.content;
      console.log("res", res);
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {

       console.log(event.target.files[0])
        

        // console.log(event);
        // let fileList: FileList = event.target.files;
        // console.log(event.target.files);
        // this.document_file = fileList[0];
        var videoType = ['video/x-flv','video/mp4','application/x-mpegURL','video/MP2T','video/3gpp',
        'video/quicktime','video/x-msvideo','video/x-ms-wmv']

        console.log(videoType.includes(event.target.files[0].type), event.target.files[0].type)

          if(videoType.includes(event.target.files[0].type)){
            this.format = 'video';
          } else if(event.target.files[0].type == "application/pdf"){
            this.format = 'pdf';
          } else{
            this.format = 'image';
          }
          console.log(this.format)


         let fileList: FileList = event.target.files;

        this.bannerFile = fileList[0];

        // this.bannerFile =  event.target.files[0]
        console.log("event.target.files[0]", event.target.files[0]);
        
        this.fileName = event.target.files[0].name;
        this.fileExt = event.target.files[0].type;
        this.fileUploadFlag = true;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.url =  event.target.result;
          this.urlSafe=  this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
          
        }
        // this.url = event.target.files[0]
      
      //  console.log(this.url)
      // if (event.target.files[0].type == "application/pdf") {
      //   // console.log(event.target.files[0].type)
        

      //   // console.log(event);
      //   // let fileList: FileList = event.target.files;
      //   // console.log(event.target.files);
      //   // this.document_file = fileList[0];

      //    let fileList: FileList = event.target.files;

      //   this.bannerFile = fileList[0];

      //   // this.bannerFile =  event.target.files[0]
      //   console.log("event.target.files[0]", event.target.files[0]);
      //   this.fileName = event.target.files[0].name;
      //   this.fileExt = event.target.files[0].type;
      //   this.fileUploadFlag = true;
      //   var reader = new FileReader();
      //   reader.readAsDataURL(event.target.files[0]);
      //   reader.onload = (event) => {
      //     this.url = event.target.result;
      //   }
      // } else {
      //   this.toastr.error('', 'Please Select PDF File')
      // }

    }
  }

  removerBanner() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    this.fileUploadFlag = false;
    this.fileName = "";
    this.url = "";
  }


  // onSelectFile(event) {
  //     if (event.target.files && event.target.files[0]) {
  //       this.bannerFile = event.target.files[0];
  //       console.log("event.target.files[0]",event.target.files[0]);
  //       this.fileName = event.target.files[0].name;
  //       this.fileExt = event.target.files[0].type;
  //     }
  // }

  // async uploadBanner(){
  //   if(this.bannerFile != null){
  //     await this._servicesService.getPresignedUrl(this.fileName,this.fileExt).subscribe( async URL =>{
  //       let preSignedURL:any = URL;
  //       this.photoFilename = preSignedURL.photoFilename;
  //       console.log("preSignedURL",preSignedURL);
  //       await this._servicesService.putImageToS3(preSignedURL.uploadURL,this.bannerFile).subscribe(async res =>{
  //         let imgData:any = res;
  //         console.log("imgData",imgData);
  //         await this.putAnnounceData();
  //       });
  //     });
  //   }else{
  //     this.putAnnounceData();
  //   }

  // }

  uploadBanner(form: NgForm) {

    console.log(form.value)
    let formData: FormData = new FormData();
    if (!this.announceTitle ) {
      this.toastr.error('', 'Please fill Title');
    } else if ((!this.announceContent) && (this.bannerFile == null)) {
      // !this.announceContent && this.bannerFile !=null
      this.toastr.error('', 'Please fill Content');
    } else {
      this.loading = true
      formData.append('description', form.value.announceContent)
      formData.append('title', form.value.announceTitle)

      if(this.bannerFile !=null){
        formData.append('file', this.bannerFile);
        formData.append('fileExist', 'true')
      }else{
        formData.append('file', '');
        formData.append('fileExist', 'false')
      }
      console.log(typeof formData.get('file'))
      this._servicesService.postFormdata("createAnnouncement", formData).subscribe(res => {
        console.log(res)
        let respObj: any;
        respObj = res;
        console.log(respObj);
        if (respObj.success) {
          this.getAnnouncement()
          $('#addUser').modal('hide');
          this.url = ""
          this.fileName = ""
          this.toastr.success('', respObj.message);
          this.loading = false
          this.bannerFile =null
        } else {
          this.toastr.error('', respObj.message);
          this.loading = false
        }

      }, err => {
        // console.log(err)
        this.toastr.error('', "Try Again Later");
        this.loading = false
      },
      );
    }

  }

  updateAnnonce() {
    var body = {
      title: this.announceTitle,
      content: this.announceContent
    }
    console.log(body)
  }

  putAnnounceData() {
    let id = Math.floor(Math.random() * (environment.max - environment.min + 1) + environment.min);
    let data = {
      "announcementId": JSON.stringify(id),
      "phoneNumber": this.userNumber,
      "mediaUrl": "NA",
      "content": this.announceContent,
      "title": this.announceTitle,
      "read": "no"
    }
    this.photoFilename ? data.mediaUrl = `https://assets-barnabas-v2.s3.us-east-1.amazonaws.com/${this.photoFilename}` : data.mediaUrl = "NA";
    this._servicesService.storeAnnouncementData(data).subscribe(res => {
      console.log("storeBannerData", res);
      this.getAnnouncement();
      this.closeModal();
      this.clearFields();
      this.toastr.success('SUCCESS', 'Announcement uploaded successfully');
    });
  }

  clearFields() {
    this.announceTitle = "";
    this.announceContent = "";
    this.fileName = "";
    this.fileExt = "";
    this.bannerFile = null;
    this.photoFilename = "";
  }
  playPause() {
    var myVideo: any = document.getElementById("my_video_1");
    myVideo.pause();
  }
  deleteAnnounce(data) {
    this._servicesService.postQuery("deleteAnnouncement?announcementId=", data.id).subscribe(res => {
      let respObj: any;
      respObj = res;
      console.log(respObj);
            if (respObj.success) {
              this.getAnnouncement()
              this.toastr.success('', respObj.message);

            } else {
              this.toastr.error('', respObj.message);
            }
          }, err => {
            // console.log(err)
            this.toastr.error('', "Try Again Later");
            },
    );

  }

  getImage(announce) {
    console.log(announce)
    // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this._servicesService.baseURL1+"getannouncementImage?announcementid="+announce.id+"&fileName="+announce.filename)
    var video_file = ['mp4', 'm4a', 'm4p', 'm4b', 'm4r', 'm4v', 'm3u', 'm3u8',	'm3u', 'm3u8','3gp',
                'm1v','ogg','webm', 'mov', 'qt', 'm4v', 'wmv', 'avi','asf', 'wma', 'wmv']
    var image_file = ['jpg','png']
    var fileMime = announce.filename.split(".").pop().trim()
    if(video_file.includes(fileMime)){
      this.video_mimetype = true
      this.image_mimetype = false
      this.document_mimetype = false
      console.log('Video')
    }
    else if(image_file.includes(fileMime)) {
      this.image_mimetype = true
      this.video_mimetype = false
      this.document_mimetype = false
      console.log('Image')
    }
    else {
      this.document_mimetype = true
      this.video_mimetype = false
      this.image_mimetype = false
      console.log('document')
    }
    this.getUrl = this._servicesService.baseURL1 + "getannouncementImage?id="+announce.id
    // this._servicesService.get('downloadAnnouncement?id='+announce.id).subscribe(res => {
    //   let data: any = res;
    //   var url = data.content.substring(1)
    //   this.getUrl = this._servicesService.baseURL1 + "getannouncementImage?id="+83
    //   console.log("res", this.getUrl);
    // });
    // this.urlSafe = this._servicesService.baseURL1 + "getannouncementImage?announcementid=" + announce.id + "&fileName=" + announce.filename;
    console.log(this.getUrl)
    this.openDocumentmodal()
    // window.open(this.urlSafe.toString(), "_blank")
    // return this.getUrl

  }
  linkOpen(announce) {
    // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this._servicesService.baseURL1+"getannouncementImage?announcementid="+announce.id+"&fileName="+announce.filename)
   var linkUrl = announce.description
   console.log(linkUrl.includes('http'));
   if(linkUrl.includes('http')){
    window.open(linkUrl.toString(), "_blank")
    return linkUrl
   }else {
     this.toastr.error('','It is not a link')
   }
    

  }

  getImageEdit() {

    return this._servicesService.baseURL1 + "getannouncementImage?announcementid=" + this.id + "&fileName=" + this.fileName;

  }

  openModal() {
    this.isCreate = true
    this.isEdit = false
    this.isView = false
    this.modelTitle = "CREATE"
    this.announceTitle = ""
    this.announceContent = ""
    this.fileName= ""
    this.fileUploadFlag = false

    $('#addUser').modal('show');
  }

  openDocumentmodal(){
    $('#documentView').modal('show');
  }

  editAnnonce(data) {
    $('#addUser').modal('show');
    this.isEdit = true
    this.isCreate = false
    this.isView = false
    this.modelTitle = "EDIT"
    console.log(data)
    // this.url=this._servicesService.baseURL1+"getannouncementImage?announcementid="+data.id+"&fileName="+data.filename;
    this.announceTitle = data.title
    this.announceContent = data.description
    this.fileName = data.filename
    this.id = data.id
    this.getImageEdit()


  }

  viewAnnonce(data) {
    $('#addUser').modal('show');
    this.modelTitle = "VIEW"
    this.isView = true
    this.isEdit = false
    this.isCreate = false
    console.log(data)
    this.announceTitle = data.title
    this.announceContent = data.description
  }

  closeModal() {
   
     this.getUrl = ""
    $('#addUser').modal('hide');
  }
  docModal() {
    this.getUrl = ""
    $('#documentView').modal('hide');
  }
}
