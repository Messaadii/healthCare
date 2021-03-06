import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AppointmentGet } from 'src/model/AppointmentGet';
import { AppointmentInfoForSec } from 'src/model/AppointmentInfoForSec';
import { AppointmentPost } from 'src/model/AppointmentPost';
import { IntegerAndStringPost } from 'src/model/IntegerAndStringPost';

const APPOINTMENT_API = environment.apiUrl+'api/appointment/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }

  public add(appointmentPost:AppointmentPost){
    return this.http.post<boolean>(APPOINTMENT_API + "add",appointmentPost,httpOptions);
  }

  public appointmentsCountByDoctorIdAndDate(integerAndStringPost:IntegerAndStringPost){
    return this.http.post<number>(APPOINTMENT_API + "appointmentsCountByDoctorIdAndDate",integerAndStringPost,httpOptions);
  }

  public getPatientAppointmentByPatientId(id:number,page:number,size:number){
    return this.http.post<AppointmentGet []>(APPOINTMENT_API + 'getPatientAppointmentByPatientId',{id,page,size},httpOptions)
  }

  public getAppointmentByDoctorIdAndDate(id:number,page:number,size:number,date:string){
    return this.http.post<AppointmentGet []>(APPOINTMENT_API + 'getAppointmentByDoctorIdAndDate',{id,page,date,size},httpOptions)
  }

  public getAppointmentNumberByDoctorIdAndDate(id:number,date:string){
    return this.http.post<number>(APPOINTMENT_API + 'getAppointmentNumberByDoctorIdAndDate',{id,date},httpOptions);
  }

  public deleteAppointmentById(id:number){
    return this.http.delete<boolean>(APPOINTMENT_API + "deleteAppointmentById/"+id,httpOptions)
  }

  public updateAppointmentDateById(appointmentId:number,doctorId:number,patientId:number,date:string){
    return this.http.post<boolean>(APPOINTMENT_API + "updateAppointmentDateById",{appointmentId,doctorId,patientId,date},httpOptions);
  }

  public changeAppointmentStatusById(integer:number,string:string){
    return this.http.post<boolean>(APPOINTMENT_API + "changeAppointmentStatusById",{integer,string},httpOptions);
  }

  public getAppointmentByDoctorIdAndPatientId(userId:number,doctorId:number,page:number,size:number){
    return this.http.post<AppointmentGet []>(APPOINTMENT_API + 'getAppointmentByDoctorIdAndPatientId',{userId,page,doctorId,size},httpOptions)
  }

  public delayAppointmentByAppId(doctorId:number, userId:number,appointmentId:number, allPatientNumber:number, patientTurn:number,secretaryId:number,postponeBy:string){
    return this.http.post<boolean>(APPOINTMENT_API + "delayAppointmentByAppId",{doctorId,userId,appointmentId,allPatientNumber,patientTurn,secretaryId,postponeBy},httpOptions);
  }

  public getAppointmentById(appointmentId:number){
    return this.http.get<AppointmentGet>(APPOINTMENT_API + "getAppointmentById/"+appointmentId,httpOptions);
  }

  public getAppointmentByDoctorIdAndDateForSec(id:number,page:number,size:number,date:string){
    return this.http.post<AppointmentInfoForSec []>(APPOINTMENT_API + 'getAppointmentByDoctorIdAndDateForSec',{id,page,date,size},httpOptions)
  }
}
