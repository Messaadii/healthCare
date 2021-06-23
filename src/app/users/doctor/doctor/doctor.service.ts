import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AppointmentDocInfoGet } from 'src/model/AppointmentDocInfoGet';
import { AppointmentPatientInfo } from 'src/model/AppointmentPatientInfo';
import { doctor } from 'src/model/Doctor';
import { DoctorGet } from 'src/model/Doctorget';
import { DoctorInfoForPatient } from 'src/model/DoctorInfoForPatient';
import { DoctorPostWithSecureLogin } from 'src/model/DoctorPostWithSecureLogin';
import { DoctorSettingsPost } from 'src/model/DoctorSettingsPost';
import { IntegerAndStringPost } from 'src/model/IntegerAndStringPost';
import { OneStringPost } from 'src/model/OneStringPost';
import { SearchDoctorDoctorPost } from 'src/model/SearchDoctorDoctorPost';
import { SearchedDocGet } from 'src/model/SearchedDocGet';
import { SecretaryPublicInfo } from 'src/model/SecretaryPublicInfo';
import { SecretaryWork } from 'src/model/SecretaryWork';
import { SecureLoginString } from 'src/model/SecureLoginString';
import { TopRatedDoctorGet } from 'src/model/TopRatedDoctorGet';
import { TwoStringsPost } from 'src/model/TwoStringsPost';

const DOC_API = environment.apiUrl+'api/doctor/';
const IAMAGE_API = environment.apiUrl+'api/image/';
const PATIENT_API = environment.apiUrl+'api/patient/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http:HttpClient) { }

  public getDoctorSpecialitiesBySecureLogin(secureLogin:SecureLoginString){
    return this.http.post<string[]>(DOC_API + "getDoctorSpecialitiesBySecureLogin",secureLogin,httpOptions);
  }

  public getDoctorInfo(secureLogin:SecureLoginString){
    return this.http.post<DoctorGet>(DOC_API + "getDoctorInfoFromSecureLogin",secureLogin,httpOptions);
  }

  public updateDoctorInfoBySecureLogin(doctorPostWithSecureLogin:DoctorPostWithSecureLogin){
    return this.http.post<boolean>(DOC_API + "updateDoctorInfoBySecureLogin",doctorPostWithSecureLogin,httpOptions);
  }

  public updateDoctorProfilePhoto(uploadImageData:FormData){
    return this.http.post<string>(IAMAGE_API + 'upload', uploadImageData, {responseType: 'text' as 'json'});
  }
  public getDoctorPofilePhoto(imageName:string){
    return this.http.get<string>(IAMAGE_API + 'get/' + imageName,httpOptions)
  }

  public changeDoctorStatusBySecureLogin(twoStringsPost:TwoStringsPost){
    return this.http.post<boolean>(DOC_API + 'changeDoctorStatusBySecureLogin', twoStringsPost,httpOptions)
  }

  public checkIfDocumentExist(oneStringPost:OneStringPost){
    return this.http.post<boolean>(IAMAGE_API + 'checkIfDocumentExist', oneStringPost)
  }

  public changeDoctorStatusById(integerAndString:IntegerAndStringPost){
    return this.http.post<boolean>(DOC_API + 'changeDoctorStatusById', integerAndString, httpOptions)
  }

  public updateDoctorSettingsBySecurelogin(doctorSettingsPost:DoctorSettingsPost){
    return this.http.post<boolean>(DOC_API + 'updateDoctorSettingsBySecurelogin', doctorSettingsPost, httpOptions)
  }

  public deleteByImageName(imageName:string){
    return this.http.delete<number>(IAMAGE_API + 'deleteByImageName/'+imageName,httpOptions);
  }

  public deteleDoctorById(id:number){
    return this.http.delete<number>(DOC_API + 'deteleDoctorById/'+id,httpOptions);
  }

  public addspecialityTodoctor(integerAndStringPost:IntegerAndStringPost){
    return this.http.post<boolean>(DOC_API + 'addspeciality', integerAndStringPost,httpOptions)
  }

  public getPendingDoctorsNumber(){
    return this.http.get<number>(DOC_API + 'getPendingDoctorsNumber',httpOptions)
  }

  public getApprovedDoctorsBySpecialityIdAndCity (searchDoctorDoctor: SearchDoctorDoctorPost){
    return this.http.post<SearchedDocGet []>(DOC_API + 'getApprovedDoctorsBySpecialityIdAndCity',searchDoctorDoctor,httpOptions);
  } 

  public getDoctorAppointmentInfoByDoctorId (docId:number){
    return this.http.get<AppointmentDocInfoGet>(DOC_API + 'getDoctorAppointmentInfoByDoctorId/'+docId);
  } 

  public getDoctorAppointmentInfoForPatientByDoctorId (docId:number){
    return this.http.get<DoctorInfoForPatient>(PATIENT_API + 'getDoctorAppointmentInfoForPatientByDoctorId/'+docId);
  } 

  public getAppPatientInfoById(id:number){
    return this.http.get<AppointmentPatientInfo>(DOC_API + 'getAppPatientInfoById/' + id,httpOptions)
  }

  public changeCurrentPatientBySecureLogin(secureLogin:string,patientTurn,allPatientNumber,doctorId:number){
    return this.http.post<boolean>(DOC_API + 'changeCurrentPatientBySecureLogin',{secureLogin,patientTurn,allPatientNumber,doctorId},httpOptions)
  }

  public getPatientInfoById(id:number){
    return this.http.get<AppointmentPatientInfo>(PATIENT_API + "getPatientInfoById/"+id,httpOptions);
  }

  public getAppPatientInfoByDoctorIdTurnAndDate(id:number,turn:number,date:string){
    return this.http.post<AppointmentPatientInfo>(DOC_API + 'getAppPatientInfoByDoctorIdTurnAndDate',{id,turn,date},httpOptions)
  }

  public GetDoctorInfoById(doctorId:number){
    return this.http.get<doctor>(DOC_API+'getDoctorInfoByDoctorId/'+doctorId,httpOptions);
  }

  public getTopRatedDoctor(page:number,size:number){
    return this.http.post<TopRatedDoctorGet []>(DOC_API+'getTopRatedDoctor',{page,size},httpOptions);
  }

  public updatePositionBySecureLogin(secureLogin:string,latitude:string,longitude:string){
    return this.http.post<boolean>(DOC_API+'updatePositionBySecureLogin',{secureLogin,latitude,longitude},httpOptions);
  }

  public sendSeeSecretaryWorkRequest(email:string,doctorId:number){
    return this.http.post<string>(DOC_API+"sendSeeSecretaryWorkRequest",{email,doctorId}, {responseType: 'text' as 'json'});
  }

  public addSecretary(email:string,doctorId:number){
    return this.http.post<boolean>(DOC_API+"addSecretary",{email,doctorId},httpOptions);
  }

  public createSecretaryAccount(username:string,
    userPassword:string,userCity:string,userFirstName:string,
    userLastName:string,userBirthday:string,userGender:string,
    doctorId:number){
    return this.http.post<boolean>(DOC_API+"createSecretaryAccount",{username,
      userPassword,userCity,userFirstName,userLastName,userBirthday,userGender,doctorId},httpOptions);
  }

  public getMySecretaries(secureLogin:string,doctorId:number){
    return this.http.post<SecretaryPublicInfo []>(DOC_API+"getMySecretaries",{secureLogin,doctorId},httpOptions);
  }
  
  public getSecretaryWork(secureLogin:string,secretaryId:number){
    return this.http.post<SecretaryWork []>(DOC_API+"getSecretaryWorkById",{secureLogin,secretaryId},httpOptions);
  }

  public checkSecretaryCode(doctorId:number,email:string,code:number){
    return this.http.post<SecretaryPublicInfo>(DOC_API+"checkSecretaryCode",{doctorId,code,email},httpOptions);
  }
}
