import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HeaderService } from 'src/app/Headers/header/header.service';
import { UserService } from 'src/app/services/user.service';
import { IntegerAndStringPost } from 'src/model/IntegerAndStringPost';
import { OneStringPost } from 'src/model/OneStringPost';
import { PharmacyGet } from 'src/model/PharmacyGet';
import { PharmacyPostWithSecureLogin } from 'src/model/PharmacyPostWithSecureLogin';
import { SecureLoginString } from 'src/model/SecureLoginString';
import { TwoStringsPost } from 'src/model/TwoStringsPost';
import { UpdatePasswordPost } from 'src/model/UpdatePasswordPost';
import { DoctorService } from '../../doctor/doctor/doctor.service';
import { PharmacyService } from '../pharmacy.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {

  constructor(private pharmacyService: PharmacyService,
    private headerService: HeaderService,
    private translate: TranslateService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private doctorService: DoctorService) { }
  pharmacyPostWithSecureLogin: PharmacyPostWithSecureLogin;
  secureLoginString: SecureLoginString;
  re = /^[A-Za-z-' ']+$/;
  generalInfo: string = 'show';
  pharmacyGet: PharmacyGet;
  pharmacyInfo: boolean;
  pharmacyName: string;
  invalidPharmacyNameVariable: boolean;
  pharmacyNameInformation: string;
  adress: string;
  cities: string[] = ["Ariana", this.translate.instant('Beja'), "Ben Arous", "Bizerte", this.translate.instant('Gabes'), "Gafsa", "Jendouba", "Kairouan", "Kasserine", this.translate.instant('Kebili'), "Kef", "Mahdia", "Manouba", this.translate.instant('Medenine'), "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];
  invalidAdressVariable: boolean;
  adressInformation: string;
  disableSaveBtn: boolean = true;
  mail: string; password: string;
  disableUpdateUsernamePassBtn: boolean = false;
  editPassword: boolean;
  editeSecureInfo: boolean = false;
  passwordRepeatInfromation: string;
  passwordInfromation: string;
  mailInformation: string;
  invalidMailVariable: boolean; invalidPasswordVariable: boolean;
  twoStringsPost: TwoStringsPost;
  passwordRepeat: string; invalidPasswordRepeatVariable: boolean;
  updatePasswordPost: UpdatePasswordPost;
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  container: string = 'profile';
  passwordDis: boolean = true;
  cinPic: Boolean = false; pharmacyOwnershipPic: Boolean = false; pharmacySpecialty: Boolean = false;
  notApproved:string='info';

  ngOnInit(): void {
    this.headerService.setHeader('pharmacy');
    this.pharmacyInfo = false;
    this.getUserInfo();
  }

  checkForm() {
    //name
    if (this.pharmacyName.length < 3) {
      this.invalidPharmacyNameVariable = true;
      this.pharmacyNameInformation = this.translate.instant('nameFirst');
    } else {
      if (this.re.test(this.pharmacyName)) {
        this.invalidPharmacyNameVariable = false;
        this.pharmacyNameInformation = this.translate.instant('pharmacyName');
      }
      else {
        this.invalidPharmacyNameVariable = true;
        this.pharmacyNameInformation = this.translate.instant('nameApha');
      }
    }

    //address
    let lowerCaseAdress: string = this.adress.toLocaleLowerCase();
    this.adress = this.adress.replace('é', 'e');
    this.adress = this.adress.replace('è', 'e');
    for (let city of this.cities) {
      if (lowerCaseAdress == city.toLocaleLowerCase()) {
        this.invalidAdressVariable = false;
        this.adressInformation = this.translate.instant('city');
        break;
      }
      else {
        this.invalidAdressVariable = true;
        this.adressInformation = this.translate.instant('enterValidCity');
      }
    }

    if (!this.invalidAdressVariable && !this.invalidPharmacyNameVariable) {
      let data: PharmacyPostWithSecureLogin = new PharmacyPostWithSecureLogin(this.pharmacyName, this.adress, localStorage.getItem('secureLogin'));
      this.pharmacyService.updatePharmacyInfoBySecureLogin(data).subscribe(
        res => {
          if (res) {
            this.toastr.success(this.translate.instant('infoUpdated'), this.translate.instant('update'), {
              timeOut: 3500,
              positionClass: 'toast-bottom-left'
            });
            this.generalInfo = 'show';
            document.getElementById("generalInfoSection").scrollIntoView({ behavior: "smooth" });
            this.pharmacyGet.pharmacyFullName = this.pharmacyName;
            this.pharmacyGet.userCity = this.adress
          }
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 3500,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    }
  }

  getUserInfo() {
    this.secureLoginString = new SecureLoginString(localStorage.getItem("secureLogin"));
    this.pharmacyService.getPharmacyInfo(this.secureLoginString).subscribe(
      res => {
        if (res) {
          this.pharmacyGet = res;
          this.headerService.setHeader('pharmacy');
          this.getImage();
          this.intializeEdit();
          if (this.pharmacyGet.pharmacyStatus == 'notApproved' || this.pharmacyGet.pharmacyStatus == 'disapprovedByAdmin') {
            this.checkDocDocument(this.pharmacyGet.userId + "pharmacyCinPic");
            this.checkDocDocument(this.pharmacyGet.userId + "pharmacyOwnershipPic");
            this.checkDocDocument(this.pharmacyGet.userId + "pharmacySpecialty");
          }
          this.pharmacyInfo = true;
          localStorage.setItem('id', this.pharmacyGet.userId + '')
        } else
          this.router.navigate(['/acceuil']);
      },
      err => {
        this.toastr.info(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
          timeOut: 5000,
          positionClass: 'toast-bottom-left'
        });
      }
    );
  }

  updateUsername() {
    if (this.mail.length < 6) {
      this.invalidMailVariable = true;
      this.mailInformation = this.translate.instant('mailApha');
    } else {
      if (this.mail.indexOf(' ') !== -1) {
        this.invalidMailVariable = true;
        this.mailInformation = this.translate.instant('enterValidMail');
      }
      else {
        this.invalidMailVariable = false;
        this.mailInformation = this.translate.instant('mail');
      }
    }
    if (!this.invalidMailVariable) {
      this.twoStringsPost = new TwoStringsPost(localStorage.getItem('secureLogin'), this.mail.toLowerCase())
      this.userService.updateUsernameBySecureLogin(this.twoStringsPost).subscribe(
        async res => {
          if (!res) {
            this.invalidMailVariable = true;
            this.mailInformation = this.translate.instant('mailExist');
          } else {
            this.router.navigate(['/acceuil']);
            this.toastr.success(this.translate.instant('usernameChanged'), this.translate.instant('info'), {
              timeOut: 5000,
              positionClass: 'toast-bottom-left'
            });
            localStorage.setItem('secureLogin', '');
            localStorage.setItem('id', '');
            await this.sleep(1000);
            document.getElementById("connexionSection").scrollIntoView({ behavior: "smooth" });
          }
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    }
  }

  updatePassword() {
    if (this.password.length > 5) {
      this.invalidPasswordVariable = false;
      this.passwordInfromation = this.translate.instant('password');
    }
    else {
      this.invalidPasswordVariable = true;
      this.passwordInfromation = this.translate.instant('passwordUnder6');
    }
    if (this.passwordRepeat == this.password || this.password.length < 6) {
      this.invalidPasswordRepeatVariable = false;
      this.passwordRepeatInfromation = this.translate.instant('repeatPassword');
    }
    else {
      this.invalidPasswordRepeatVariable = true;
      this.passwordRepeatInfromation = this.translate.instant('repeatPasswordErr');
    }
    if (!this.invalidPasswordVariable && !this.invalidPasswordRepeatVariable) {
      this.updatePasswordPost = new UpdatePasswordPost(localStorage.getItem('secureLogin'), this.passwordRepeat);
      this.userService.updateUserPasswordBySecurelogin(this.updatePasswordPost).subscribe(
        async res => {
          if (!res) {
            this.toastr.warning(this.translate.instant('applicationDataChanged'), this.translate.instant('Data'), {
              timeOut: 5000,
              positionClass: 'toast-bottom-left'
            });
            localStorage.setItem('secureLogin', '');
            localStorage.setItem('id', '');
            await this.sleep(1000);
            document.getElementById("connexionSection").scrollIntoView({ behavior: "smooth" });
          } else {
            this.router.navigate(['/acceuil']);
            this.toastr.success(this.translate.instant('passwordChanged'), this.translate.instant('info'), {
              timeOut: 5000,
              positionClass: 'toast-bottom-left'
            });
            localStorage.setItem('secureLogin', '');
            localStorage.setItem('id', '');
            await this.sleep(1000);
            document.getElementById("connexionSection").scrollIntoView({ behavior: "smooth" });
          }
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    }
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  intializeEdit() {
    this.pharmacyName = this.pharmacyGet.pharmacyFullName;
    this.mail = this.pharmacyGet.userUsername;
    this.adress = this.pharmacyGet.userCity;
  }

  initializeEditLabel() {
    this.pharmacyNameInformation = this.translate.instant('pharmacyName');
    this.passwordRepeatInfromation = this.translate.instant('repeatPassword');
    this.passwordInfromation = this.translate.instant('password');
    this.mailInformation = this.translate.instant('mail');
    this.adressInformation = this.translate.instant('city');
    document.getElementById("generalInfoSection").scrollIntoView({ behavior: "smooth" });
  }

  changePasswordClick() {
    this.editeSecureInfo = true;
    this.editPassword = true;
    document.getElementById("generalInfoSection").scrollIntoView({ behavior: "smooth" });
  }

  changeUsernameClick() {
    this.editeSecureInfo = true;
    this.editPassword = false;
    document.getElementById("generalInfoSection").scrollIntoView({ behavior: "smooth" });
  }

  comparePharmacyName() {
    if (this.pharmacyName.toLowerCase() === this.pharmacyGet.pharmacyFullName)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareUserName() {
    if (this.mail.toLowerCase() === this.pharmacyGet.userUsername)
      this.disableUpdateUsernamePassBtn = true;
    else
      this.disableUpdateUsernamePassBtn = false;
  }

  compareCity() {
    if (this.adress.toLowerCase() === this.pharmacyGet.userCity)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.pharmacyGet.userId + "pharmacyProfilePic");
    this.getImage();
  }

  onUpload(imageName: string) {
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, imageName);
    this.pharmacyService.updatePharmacyProfilePhoto(uploadImageData).subscribe(
      res => {
        if (res == 'imageUpdated') {
          if (imageName == this.pharmacyGet.userId + "pharmacyCinPic")
            this.cinPic = true;
          else if (imageName == this.pharmacyGet.userId + "pharmacyOwnershipPic")
            this.pharmacyOwnershipPic = true;
          else if (imageName == this.pharmacyGet.userId + "pharmacySpecialty")
            this.pharmacySpecialty = true;
          else
            this.getImage();
        }
      },
      err => {
        this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
          timeOut: 5000,
          positionClass: 'toast-bottom-left'
        });
      }
    );
  }

  getImage() {
    this.pharmacyService.getPharmacyPofilePhoto(this.pharmacyGet.userId + "pharmacyProfilePic").subscribe(
      res => {
        if (res != null) {
          this.retrieveResonse = res;
          this.base64Data = this.retrieveResonse.picByte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        } else
          this.retrieveResonse = null;
      },
      err => {
        if (this.retrievedImage) {
          this.toastr.info(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      }
    );
  }

  onFileChangedCin(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.pharmacyGet.userId + "pharmacyCinPic");
  }

  onFileChangedMedicalClinic(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.pharmacyGet.userId + "pharmacyOwnershipPic");
  }

  onFileChangedMedicalSpecialty(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.pharmacyGet.userId + "pharmacySpecialty");
  }

  checkDocDocument(imageName: string) {
    let oneStringPost: OneStringPost = new OneStringPost(imageName);
    this.doctorService.checkIfDocumentExist(oneStringPost).subscribe(
      res => {
        if (res == true) {
          if (imageName == this.pharmacyGet.userId + "pharmacyCinPic")
            this.cinPic = true;
          else if (imageName == this.pharmacyGet.userId + "pharmacyOwnershipPic")
            this.pharmacyOwnershipPic = true;
          else if (imageName == this.pharmacyGet.userId + "pharmacySpecialty")
            this.pharmacySpecialty = true;
        }
      }
    );
  }

  submitPharmacyDocuments() {
    let twoStringsPost:TwoStringsPost = new TwoStringsPost(localStorage.getItem('secureLogin'), 'pending');
    this.pharmacyService.changePharamcyStatusBySecureLogin(twoStringsPost).subscribe(
      res => {
        if(res){
          this.pharmacyGet.pharmacyStatus='pending';
        }
      }
    );
  }

  toNotApprovedSection(){
    document.getElementById("approvePharmacySection").scrollIntoView({behavior:'smooth'});
  }
}
