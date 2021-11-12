import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private _userNumber = new BehaviorSubject('');
  public userNumber = this._userNumber.asObservable();

  private _userRole = new BehaviorSubject('');
  public userRole = this._userRole.asObservable();
  
  //baseURL:any = "https://325p0kj62c.execute-api.us-east-2.amazonaws.com/churchapi";
  baseURL:any = "https://zrrlyf7lv2.execute-api.us-east-1.amazonaws.com/churchapi";


  // baseURL1:any = "http://103.99.149.26:9876/" //kanmalai 
  baseURL1:any = "http://3.208.178.159:9875/barnabas/" //AWS 
  // baseURL1:any =  "http://192.168.86.205:9876/barnabas/" //Bipin
  // baseURL1:any = "http://192.168.29.62:9875/barnabas/" //janaki


  constructor(public http: HttpClient) { }

  

  get(url){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.get(`${this.baseURL1}`+url,{
      headers: headers
    });
  }

  post(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.post(`${this.baseURL1}`+url, body, {
      headers: headers
    });
  }

  postFormdata(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.post(`${this.baseURL1}`+url, body, {
      headers: headers
    });
  }

  postQuery(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.post(`${this.baseURL1}`+url+body,"",{
      headers: headers
    })
  }

  postQueryFormdata(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.post(`${this.baseURL1}`+url,body,{
      headers: headers
    })
  }
  getQuery(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    
    headers= headers.append("accept" ,  "*/*")
    headers=headers.append("Authorization", "Bearer "+localStorage.getItem("access_token"))
    return this.http.get(`${this.baseURL1}`+url+body,{
      headers: headers
    })
  }

  addUser(data) {
    return this.http.post(`${this.baseURL}/userModule`, data);
  }
  getUser() {
    return this.http.get(`${this.baseURL}/userModule`);
  }
  deleteUser(userId) {
    return this.http.delete(`${this.baseURL}/userModule?phoneNumber=`+userId);
  }
  updateUser(data) {
    return this.http.put(`${this.baseURL}/userModule`,data);
  }
  getCurrentUser(phoneNumber){
    
    return this.http.post(`${this.baseURL1}sendNotification?contactNumber=`+phoneNumber+`&app=WEB`,"");
    // return this.http.get(`${this.baseURL}/userModule?phoneNumber=`+phoneNumber);
 
  }

  getLogin(url,body){
    let headers: HttpHeaders = new HttpHeaders();
    headers= headers.append("Content-Type" ,  "application/x-www-form-urlencoded")
    headers=headers.append("Authorization", "Basic " + btoa("barnabas:barnabas"))
    return this.http.post(`${this.baseURL1}oauth/token`,body,{
      headers: headers
      
    }
  
    );
    // return this.http.post(`${this.baseURL}/sendNotification?contactNumber=`+phoneNumber,"");
  }
  setUserNumber(phoneNumber,userRole){
    this._userNumber.next(phoneNumber);
    this._userRole.next(userRole);
  }


  /////// user detail //////
  getUsernumber(){
    let data:any = localStorage.getItem('user');
    console.log("num -- ",data);
    return data;
  }

  getUserRole(){
    let data:any = localStorage.getItem('userRole');
    return data;
  }

// |||||||||| Mass meeting |||||||||

  getMassMeeting() {
    return this.http.get(`${this.baseURL}/massMeetingModule`);
  }

  getEventMassMeeting() {
    return this.http.get(`${this.baseURL}/eventModule`);
  }

  updateEventMassMeeting(data) {
    return this.http.put(`${this.baseURL}/eventModule`,data);
  }

  updateMassMeeting(data) {
    return this.http.put(`${this.baseURL}/massMeetingModule`,data);
  }


  // ||||||||||| media upload |||||||||

  getPresignedUrl(imgName,imgExt) {
    return this.http.get(`${this.baseURL}/uploaderModule?fname=${imgName}&extension=${imgExt}`);
  }

  putImageToS3(PresignedURL,data){
    return this.http.put(PresignedURL,data);
  }

  // ||||||||||| banner |||||||||


  getBannerTable(){
    return this.http.get(`${this.baseURL}/bannerModule`);
  }

  storeBannerData(data){
    return this.http.post(`${this.baseURL}/bannerModule`,data);
  }

  deleteBanner(data){
    return this.http.delete(`${this.baseURL}/bannerModule?bannerId=`+data);
  }


  // ||||||||||| announcement |||||||||

  getAnnouncements(){
    return this.http.get(`${this.baseURL}/announcementModule`);
  }

  getAnnouncementsByID(data){
    return this.http.get(`${this.baseURL}/announcementModule?announcementId=`+data);
  }

  deleteAnnouncements(data){
    return this.http.delete(`${this.baseURL}/announcementModule?announcementId=`+data);
  }

  storeAnnouncementData(data){
    return this.http.post(`${this.baseURL}/announcementModule`,data);
  }


  // ||||||||||| business |||||||||

  createBusinessType(data){
    return this.http.post(`${this.baseURL}/businessModule`,data);
  }

  getBusinessType(){
    return this.http.get(`${this.baseURL}/businessModule`);
  }


  // ||||||||||| classifields |||||||||

  getClassifields(){
    return this.http.get(`${this.baseURL}/classifieldModule`);
  }

  deleteClassifields(data){
    return this.http.delete(`${this.baseURL}/classifieldModule?classifieldId=`+data);
  }

  editClassifields(id,body){
    return this.http.post(`${this.baseURL}/classifieldModule?classifieldId=`+id, body);
  }

  storeClassifields(data){
    return this.http.post(`${this.baseURL}/classifieldModule`,data);
  }



  ////// profile  ////////

  getProfile(){
    return this.http.get(`${this.baseURL}/profileModule`);
  }

  updateProfile(data){
    return this.http.put(`${this.baseURL}/profileModule`,data);
  }

  // ||||||||||| confession |||||||||

  getConfesstion(){
    return this.http.get(`${this.baseURL}/confessionModule?confessionId=1`);
  }

  setConfesstion(reqData){
    return this.http.put(`${this.baseURL}/confessionModule`, reqData);
  }

  // ||||||||||| Slot |||||||||

  getSlotsByStatus(slotStatus){
    return this.http.get(`${this.baseURL}/slotModule?slotStatus=${slotStatus}`);
  }

}
