import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { FirstAndLastNameGet } from 'src/model/FirstAndLastNameGet';
import { TwoStringsPost } from 'src/model/TwoStringsPost';
import { UpdatePasswordPost } from 'src/model/UpdatePasswordPost';
import { UserSearchGet } from 'src/model/UserSearchGet';

const USER_API = environment.apiUrl+'api/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  checkIfUsernameExists(username:string):Observable<any>{
    return this.http.get<boolean>(USER_API+'existsByUsername/'+username,httpOptions);
  }

  updateUserPasswordById(updatePasswordPost:UpdatePasswordPost){
    return this.http.post<boolean>(USER_API+'updateUserPasswordById',updatePasswordPost,httpOptions);
  }

  public getUserFullNameById(docId:number) {
    return this.http.get<FirstAndLastNameGet>(USER_API + 'getUserFullNameById/'+docId, httpOptions);
  }

  checkVerifacationCode(userEmail:string,verificationCode:number){
    return this.http.post<boolean>(USER_API + 'checkVerifacationCode',{userEmail,verificationCode},httpOptions);
  }

  updateUserStatusByEmail(email:string,status:string){
    return this.http.post<boolean>(USER_API + 'updateUserStatusByEmail',{email,status},httpOptions);
  }

  updateUserPasswordByEmail(email:string,password:string){
    return this.http.post<boolean>(USER_API + 'updateUserPasswordByEmail',{email,password},httpOptions);
  }

  searchUsersByName(string:string,page:number,size:number){
    return this.http.post<UserSearchGet []>(USER_API + 'searchUsersByName',{string,page,size},httpOptions);
  }
  
}
