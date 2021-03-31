import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from 'src/app/appointment/appointment.service';
import { UserService } from 'src/app/services/user.service';
import { SpecialityService } from 'src/app/speciality/speciality.service';
import { AppointmentGet } from 'src/model/AppointmentGet';
import { AppointmentPatientInfo } from 'src/model/AppointmentPatientInfo';
import { DoctorGet } from 'src/model/Doctorget';
import { DoctorPostWithSecureLogin } from 'src/model/DoctorPostWithSecureLogin';
import { DoctorSettingsPost } from 'src/model/DoctorSettingsPost';
import { FiveStringsPost } from 'src/model/FiveStringsPost';
import { IntegerAndStringPost } from 'src/model/IntegerAndStringPost';
import { medicalProfileGet } from 'src/model/medicalProfileGet';
import { OneStringPost } from 'src/model/OneStringPost';
import { SecureLoginString } from 'src/model/SecureLoginString';
import { SpecialityGet } from 'src/model/SpecialityGet';
import { TwoStringsPost } from 'src/model/TwoStringsPost';
import { UpdatePasswordPost } from 'src/model/UpdatePasswordPost';
import { PatientService } from '../../patient/patient/patient.service';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  currentDate: string;
  specialityCode: string;
  testSpeciality: boolean;
  specialityName: string;
  fiveStringsPost: FiveStringsPost; oneStringPost: OneStringPost; twoStringsPost: TwoStringsPost; integerAndStringPost: IntegerAndStringPost;
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  re = /^[A-Za-z]+$/;
  nb = /^\d+$/;
  er = new RegExp('^[0-9]+(\.[0-9]+)*$');
  cinPic: boolean = false; medicalSpecialtyPic: boolean = false; medicalClinicPic: boolean = false;
  doctorGet: DoctorGet;
  disabledUpdateBtn: boolean = true;
  doctorSettings: boolean = true; notApproved: string = 'info'; container: string = 'profile'; generalInfo: string = 'show';
  disableSaveBtn: boolean = true;
  disableSavePassBtn: boolean = true;
  specialityInformation: string; speciality: string; specialityGet: SpecialityGet[] = [];
  invalidSpecialityVariable: boolean;
  maleCheckBox: boolean; femaleCheckBox: boolean;
  doctorPostWithSecureLogin: DoctorPostWithSecureLogin;
  secureLogin: SecureLoginString = new SecureLoginString(localStorage.getItem('secureLogin'));
  Mon: boolean; Tue: boolean; Wed: boolean; Thu: boolean; Fri: boolean; Sat: boolean; Sun: boolean; selectDay: boolean = false;

  constructor(private doctorService: DoctorService, private toastr: ToastrService, private translate: TranslateService, private router: Router, private specialityService: SpecialityService, private patientService: PatientService, private userService: UserService, private appointmentService: AppointmentService) { }
  invalidAppointmentPrice: boolean; invalidAppointmentApproximateDuration: boolean; invalidExactAdress: boolean; invalidStartTime: boolean; invalidMaxPatientPerDay: boolean; invalidFirstNameVariable: boolean; invalidLastNameVariable: boolean; invalidMailVariable: boolean; invalidDayVariable: boolean; invalidMonthVariable: boolean; invalidYearVariable: boolean; invalidAdressVariable: boolean; invalidPasswordVariable: boolean; invalidPasswordRepeatVariable: boolean;
  appointmentApproximateDurationInformation: string; appointmentPriceInformation: string; exactAdressInformation: string; startTimeInformation: string; maxPatientPerDayInformation: string; passwordRepeatInfromation: string; passwordInfromation: string; firstNameInformation: string; lastNameInformation: string; mailInformation: string; dayInformation: string; monthInformation: string; yearInformation: string; adressInformation: string;
  appointmentApproximateDuration: string; appointmentPrice: string; exactAdress: string; startTime: string; maxPatientPerDay: string; firstName: string; lastName: string; mail: string; day: string; month: string; year: string; adress: string; password: string; passwordRepeat: string;
  docInfo: boolean;
  toadyAppointmentPatientInfo: AppointmentPatientInfo[];
  tomorrowAppointmentPatientInfo: AppointmentPatientInfo[];
  completedAppointmentPatientInfo: AppointmentPatientInfo[];
  nextAppointmentPatientInfo: AppointmentPatientInfo[];
  patientTodayProfilePicRes: any[]; patientTomorrowProfilePicRes: any[];
  patientTodayProfilePic: any[]; patientTomorrowProfilePic: any[];
  patientStart: number = 0; patientTomorrowStart: number = 0;
  patientFinish: number = 0; patientTomorrowFinish: number = 0;
  showpatientNavigationRight: boolean; showTomorrowpatientNavigationRight: boolean;
  showpatientNavigationLeft: boolean; showTomorrowpatientNavigationLeft: boolean;
  lengthTested: boolean; tommorowLengthTested: boolean;
  patientInfo: boolean = false; tomorrowPatientInfo: boolean = false;
  patientKey: number; tomorrowPatientKey: number;
  todayPatientMedicalProfileGet: medicalProfileGet[] = []; tomorrowPatientMedicalProfileGet: medicalProfileGet[] = [];
  accountDeleted: boolean = false;
  doctorSpecialities: string[] = [];
  doctorSettingsPost: DoctorSettingsPost;
  editPass: boolean = false;
  updatePasswordPost: UpdatePasswordPost;
  editGeneralInformation: boolean = true;
  editPassword: boolean;
  cities: string[] = ["Ariana", this.translate.instant('Beja'), "Ben Arous", "Bizerte", this.translate.instant('Gabes'), "Gafsa", "Jendouba", "Kairouan", "Kasserine", this.translate.instant('Kebili'), "Kef", "Mahdia", "Manouba", this.translate.instant('Medenine'), "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];
  todayAppPage: number = 0; tomorrowAppPage: number = 0;
  docTodayAppointments: AppointmentGet[] = []; docTomorrowAppointments: AppointmentGet[] = [];
  todayPatientNumber: number; tomorrowPatientNumber: number;
  todayAppCharged: boolean = false; tomorrowAppCharged: boolean = false;
  currentPatientInfo: AppointmentPatientInfo[] = [];
  nextPatientInfo: AppointmentPatientInfo; backPatientInfo: AppointmentPatientInfo;
  currentPatientProfileImg: any[] = [];
  currentPatientMedicalProfile: medicalProfileGet[] = []; currentPatientMedicalProfileDiseases: medicalProfileGet[] = [];
  loadingCurrentPatientInfo: boolean = false;
  addToCurrentPatient:string;

  ngOnInit(): void {
    this.lengthTested = false; this.tommorowLengthTested = false;
    this.toadyAppointmentPatientInfo = []; this.tomorrowAppointmentPatientInfo = []; this.completedAppointmentPatientInfo = []; this.nextAppointmentPatientInfo = []; this.patientTodayProfilePicRes = []; this.patientTodayProfilePic = []; this.patientTomorrowProfilePicRes = []; this.patientTomorrowProfilePic = [];
    this.currentDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    this.docInfo = false;
    this.getDoctorInfo();
    this.getAllSpecialities();
  }

  getDoctorInfo() {
    this.doctorService.getDoctorInfo(this.secureLogin).subscribe(
      res => {
        if (res) {
          this.doctorGet = res;
          this.getPatientNumber(this.currentDate, 'today');
          if (this.doctorGet.currentPatient != 0)
            this.getPatientByTurn(true);
          else
            this.getTodayAppPatientByDate(true);
          this.getTomorrowAppPatientByDate(true);
          if (this.doctorGet.doctorStatus == 'disapprovedPermanently') {
            this.deleteAccount();
            this.accountDeleted = true;
          } else {
            this.getAppPatientInfo();
            this.docInfo = true;
            this.getDoctorSpecialities();
            localStorage.setItem('id', this.doctorGet.userId.toString());
            if (this.doctorGet.doctorStatus == 'notApproved' || this.doctorGet.doctorStatus == 'disapprovedByAdmin') {
              this.checkDocDocument(this.doctorGet.userId + "doctorCinPic");
              this.checkDocDocument(this.doctorGet.userId + "doctorMedicalClinicPic");
              this.checkDocDocument(this.doctorGet.userId + "doctorMedicalSpecialty");
            }
            this.getImage(this.doctorGet.userId + "doctorProfilePic");
            this.intializeEdit();
            this.initializeAccountSettings();
            this.initializeEditAccountSettigns();
          }
        } else
          this.router.navigate(['/acceuil']);
      },
      err => {
        this.router.navigate(['/acceuil']);
        console.clear;
      }
    );
  }

  checkForm() {
    this.checkFirstName();
    this.checkLastName();
    this.checkAdress();
    this.checkBirthday();
    if (!this.invalidAdressVariable && !this.invalidFirstNameVariable && !this.invalidLastNameVariable && !this.invalidDayVariable && !this.invalidMonthVariable && !this.invalidYearVariable) {
      let birthday: string = this.day + '/' + this.month + '/' + this.year;
      let gender: string;
      if (this.maleCheckBox == true)
        gender = 'male';
      else
        gender = 'female';
      this.doctorPostWithSecureLogin = new DoctorPostWithSecureLogin(this.mail.toLowerCase(), this.firstName.toLowerCase(), this.lastName.toLowerCase(), this.adress.toLowerCase(), this.passwordRepeat, birthday, gender.toLowerCase(), localStorage.getItem("secureLogin"));
      this.doctorService.updateDoctorInfoBySecureLogin(this.doctorPostWithSecureLogin).subscribe(
        res => {
          if (!res) {
            this.invalidMailVariable = true;
            this.mailInformation = this.translate.instant('mailExist');
          } else {
            this.getDoctorInfo();
            this.invalidMailVariable = false;
            this.generalInfo = 'show';
            this.toastr.success(this.translate.instant('infoUpdated'), this.translate.instant('update'), {
              timeOut: 5000,
              positionClass: 'toast-bottom-left'
            });
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
      this.updatePasswordPost = new UpdatePasswordPost(localStorage.getItem('secureLogin'), this.password);
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

  changePasswordClick() {
    this.editGeneralInformation = false;
    this.editPassword = true;
    this.toGeneralInfoSection();
  }

  changeUsernameClick() {
    this.editGeneralInformation = false;
    this.editPassword = false;
    this.toGeneralInfoSection();
  }

  ckeckFormAndUpdate(status: string) {
    if (parseInt(this.maxPatientPerDay) > 0 && parseInt(this.maxPatientPerDay) < 100 && this.maxPatientPerDay.length != 0) {
      this.invalidMaxPatientPerDay = false;
    } else {
      this.invalidMaxPatientPerDay = true;
      this.maxPatientPerDayInformation = this.translate.instant('maxPatientPerDayInvalid');
    }
    if (this.startTime == null) {
      this.invalidStartTime = true;
      this.startTimeInformation = this.translate.instant('startTimeInvalid');
    } else {
      if (this.startTime.charAt(1) == ':') {
        if (parseInt(this.startTime.slice(0, 1)) >= 7 && parseInt(this.startTime.slice(0, 1)) < 10 && parseInt(this.startTime.slice(2, 4)) >= 0 && parseInt(this.startTime.slice(2, 4)) < 60) {
          this.invalidStartTime = false;
        } else {
          this.invalidStartTime = true;
          this.startTimeInformation = this.translate.instant('startTimeInvalid');
        }
      } else if (this.startTime.charAt(2) == ':') {
        if (parseInt(this.startTime.slice(0, 2)) >= 10 && parseInt(this.startTime.slice(0, 2)) < 13 && parseInt(this.startTime.slice(3, 5)) >= 0 && parseInt(this.startTime.slice(3, 5)) < 60) {
          this.invalidStartTime = false;
        } else {
          this.invalidStartTime = true;
          this.startTimeInformation = this.translate.instant('startTimeInvalid');
        }
      } else {
        this.invalidStartTime = true;
        this.startTimeInformation = this.translate.instant('startTimeInvalid');
      }
    }
    if (this.appointmentPrice != null && parseInt(this.appointmentPrice) > 0 && parseInt(this.appointmentPrice) < 500) {
      this.invalidAppointmentPrice = false;
      if (this.appointmentApproximateDuration != null && parseInt(this.appointmentApproximateDuration) > 0 && parseInt(this.appointmentApproximateDuration) < 60) {
        this.invalidAppointmentApproximateDuration = false;
      } else {
        this.appointmentApproximateDurationInformation = this.translate.instant('appointmentApproximateDurationInvalid');
        this.invalidAppointmentApproximateDuration = true;
      }
    } else {
      this.appointmentPriceInformation = this.translate.instant('appointmentPriceInvalid');
      this.invalidAppointmentPrice = true;
    }

    if (!this.invalidStartTime && !this.invalidMaxPatientPerDay && this.exactAdress != null && !this.invalidAppointmentApproximateDuration && !this.invalidAppointmentPrice) {
      if (this.exactAdress.length >= 10) {
        this.invalidExactAdress = false;
        if (this.Mon || this.Tue || this.Wed || this.Thu || this.Fri || this.Sat || this.Sun) {
          this.selectDay = false;
          let workDays: string = '';
          if (this.Mon == true)
            workDays = workDays + 'Mon ';
          if (this.Tue == true)
            workDays = workDays + 'Tue ';
          if (this.Wed == true)
            workDays = workDays + 'Wed ';
          if (this.Thu == true)
            workDays = workDays + 'Thu ';
          if (this.Fri == true)
            workDays = workDays + 'Fri ';
          if (this.Sat == true)
            workDays = workDays + 'Sat ';
          if (this.Sun == true)
            workDays = workDays + 'Sun ';
          this.doctorSettingsPost = new DoctorSettingsPost(localStorage.getItem('secureLogin'), this.startTime, this.exactAdress, workDays, parseInt(this.maxPatientPerDay), parseInt(this.appointmentPrice), parseInt(this.appointmentApproximateDuration));
          this.doctorService.updateDoctorSettingsBySecurelogin(this.doctorSettingsPost).subscribe(
            res => {
              if (res) {
                if (status == 'set') {
                  console.log('set');
                  this.twoStringsPost = new TwoStringsPost(localStorage.getItem('secureLogin'), 'approved');
                  this.doctorService.changeDoctorStatusBySecureLogin(this.twoStringsPost).subscribe(
                    res => {
                      if (res) {
                        this.toastr.success(this.translate.instant('infoUpdated'), this.translate.instant('update'), {
                          timeOut: 5000,
                          positionClass: 'toast-bottom-left'
                        });
                        this.ngOnInit();
                      }
                    }
                  );
                } else {
                  console.log('update');
                  this.toastr.success(this.translate.instant('infoUpdated'), this.translate.instant('update'), {
                    timeOut: 5000,
                    positionClass: 'toast-bottom-left'
                  });
                  this.ngOnInit();
                }
              }
            },
            err => {
              this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
                timeOut: 5000,
                positionClass: 'toast-bottom-left'
              });
            }
          );
        } else
          this.selectDay = true;
      } else {
        this.invalidExactAdress = true;
        this.exactAdressInformation = this.translate.instant('exactAdressInvalid');
      }
    } else {
      this.invalidExactAdress = true;
      this.exactAdressInformation = this.translate.instant('exactAdressInvalid');
    }
  }

  checkLastName() {
    if (this.lastName.length < 3) {
      this.invalidLastNameVariable = true;
      this.lastNameInformation = this.translate.instant('firstSurname');
    } else {
      if (this.re.test(this.lastName)) {
        this.invalidLastNameVariable = false;
        this.lastNameInformation = this.translate.instant('surname');
      }
      else {
        this.invalidLastNameVariable = true;
        this.lastNameInformation = this.translate.instant('surnameApha');
      }
    }
  }

  checkFirstName() {
    if (this.firstName.length < 3) {
      this.invalidFirstNameVariable = true;
      this.firstNameInformation = this.translate.instant('nameFirst');
    } else {
      if (this.re.test(this.firstName)) {
        this.invalidFirstNameVariable = false;
        this.firstNameInformation = this.translate.instant('firstName');
      }
      else {
        this.invalidFirstNameVariable = true;
        this.firstNameInformation = this.translate.instant('nameApha');
      }
    }
  }

  intializeEdit() {
    this.password = null;
    this.passwordRepeat = null
    this.firstName = this.doctorGet.doctorFirstName;
    this.lastName = this.doctorGet.doctorLastName;
    this.mail = this.doctorGet.userUsername;
    this.adress = this.doctorGet.userCity;
    this.day = this.doctorGet.doctorBirthDay.substr(0, 2);
    this.month = this.doctorGet.doctorBirthDay.substr(3, 2);
    this.year = this.doctorGet.doctorBirthDay.substr(6, 4);
    if (this.doctorGet.doctorGender == 'male')
      this.maleCheckBox = true;
    else
      this.femaleCheckBox = true;
  }

  initializeEditLabel() {
    this.firstNameInformation = this.translate.instant('firstName');
    this.passwordRepeatInfromation = this.translate.instant('repeatPassword');
    this.passwordInfromation = this.translate.instant('password');
    this.lastNameInformation = this.translate.instant('surname');
    this.mailInformation = this.translate.instant('mail');
    this.dayInformation = this.translate.instant('day');
    this.monthInformation = this.translate.instant('month');
    this.yearInformation = this.translate.instant('year');
    this.adressInformation = this.translate.instant('city');
    this.toGeneralInfoSection();
  }

  checkAdress() {
    let upperCaseAdress: string = this.adress.toUpperCase();
    this.adress = this.adress.replace('é', 'e');
    this.adress = this.adress.replace('è', 'e');
    for (let city of this.cities) {
      if (upperCaseAdress == city.toUpperCase()) {
        this.invalidAdressVariable = false;
        this.adressInformation = this.translate.instant('city');
        break;
      }
      else {
        this.invalidAdressVariable = true;
        this.adressInformation = this.translate.instant('enterValidCity');
      }
    }
  }

  checkDisabledBtnFromMale() {
    if (this.doctorGet.doctorGender == 'female')
      this.disableSaveBtn = false;
    else
      this.disableSaveBtn = true;
  }

  checkDisabledBtnFromFemale() {
    if (this.doctorGet.doctorGender == 'male')
      this.disableSaveBtn = false;
    else
      this.disableSaveBtn = true;
  }

  checkBirthday() {
    if ((parseInt(this.day) <= 31 && parseInt(this.day) > 0) && (this.nb.test(this.day) && this.day.length == 2)) {
      this.invalidDayVariable = false;
      this.dayInformation = this.translate.instant('day');
    }
    else {
      this.invalidDayVariable = true;
      this.dayInformation = this.translate.instant('dayErr');
    }
    if ((parseInt(this.month) <= 12 && parseInt(this.month) > 0) && (this.nb.test(this.month) && this.month.length == 2)) {
      this.invalidMonthVariable = false;
      this.monthInformation = this.translate.instant('month');
    }
    else {
      this.invalidMonthVariable = true;
      this.monthInformation = this.translate.instant('monthErr');
    }
    if ((parseInt(this.year) <= 2021 && parseInt(this.year) > 1900) && (this.nb.test(this.year) && this.year.length == 4)) {
      this.invalidYearVariable = false;
      this.yearInformation = this.translate.instant('year');
    }
    else {
      this.invalidYearVariable = true;
      this.yearInformation = this.translate.instant('yearErr');
    }
  }

  compareFirstName() {
    if (this.firstName.toLowerCase() === this.doctorGet.doctorFirstName)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareLastName() {
    if (this.lastName.toLowerCase() === this.doctorGet.doctorLastName)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareUserName() {
    if (this.mail.toLowerCase() === this.doctorGet.userUsername)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareDay() {
    if (this.day === this.doctorGet.doctorBirthDay.substr(0, 2))
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareMonth() {
    if (this.month === this.doctorGet.doctorBirthDay.substr(3, 2))
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareYear() {
    if (this.year === this.doctorGet.doctorBirthDay.substr(6, 4))
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  compareCity() {
    if (this.adress.toLowerCase() === this.doctorGet.userCity)
      this.disableSaveBtn = true;
    else
      this.disableSaveBtn = false;
  }

  comparePassword() {
    if (this.password.length == 0 || this.password == null)
      this.disableSavePassBtn = true;
    else
      this.disableSavePassBtn = false;
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.doctorGet.userId + "doctorProfilePic");
  }

  onUpload(imageName: string) {
    if (this.doctorGet.userId == parseInt(localStorage.getItem('id'))) {
      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', this.selectedFile, imageName);
      this.doctorService.updateDoctorProfilePhoto(uploadImageData).subscribe(
        res => {
          if (res == 'imageUpdated')
            this.getImage(imageName);
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    } else {
      this.toastr.info(this.translate.instant('applicationDataChanged'), this.translate.instant('Data'), {
        timeOut: 5000,
        positionClass: 'toast-bottom-left'
      });
    }
  }

  getImage(imageName: string) {
    if (this.doctorGet.userId == parseInt(localStorage.getItem('id'))) {
      if (imageName == this.doctorGet.userId + "doctorProfilePic") {
        this.doctorService.getDoctorPofilePhoto(imageName).subscribe(
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
      } else if (imageName == this.doctorGet.userId + "doctorCinPic")
        this.cinPic = true;
      else if (imageName == this.doctorGet.userId + "doctorMedicalClinicPic")
        this.medicalClinicPic = true;
      else if (imageName == this.doctorGet.userId + "doctorMedicalSpecialty")
        this.medicalSpecialtyPic = true;
    } else {
      this.toastr.info(this.translate.instant('applicationDataChanged'), this.translate.instant('Data'), {
        timeOut: 5000,
        positionClass: 'toast-bottom-left'
      });
    }
  }

  onFileChangedCin(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.doctorGet.userId + "doctorCinPic");
  }

  onFileChangedMedicalClinic(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.doctorGet.userId + "doctorMedicalClinicPic");
  }

  onFileChangedMedicalSpecialty(event) {
    this.selectedFile = event.target.files[0];
    this.onUpload(this.doctorGet.userId + "doctorMedicalSpecialty");
  }

  submitDoctorDocuments() {
    this.testSpeciality = true;
    if (this.specialityName != null) {
      for (let spec of this.specialityGet) {
        if (this.translate.instant(spec.specialityCode).toLowerCase() == this.specialityName.toLowerCase()) {
          this.testSpeciality = false;
          this.specialityCode = spec.specialityCode;
          break;
        }
      }
    }
    if (this.testSpeciality) {
      this.invalidSpecialityVariable = true;
      this.specialityInformation = this.translate.instant('invalidSpeciality');
    } else {
      this.invalidSpecialityVariable = false;
      this.specialityInformation = this.translate.instant('speciality');
      this.twoStringsPost = new TwoStringsPost(localStorage.getItem('secureLogin'), 'pending');
      this.doctorService.changeDoctorStatusBySecureLogin(this.twoStringsPost).subscribe(
        res => {
          if (res) {
            this.integerAndStringPost = new IntegerAndStringPost(this.doctorGet.userId, this.specialityCode)
            this.doctorService.addspecialityTodoctor(this.integerAndStringPost).subscribe(
              res => {
                if (res) {
                  this.getDoctorInfo();
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

  checkDocDocument(imageName: string) {
    this.oneStringPost = new OneStringPost(imageName);
    this.doctorService.checkIfDocumentExist(this.oneStringPost).subscribe(
      res => {
        if (res == true) {
          if (imageName == this.doctorGet.userId + "doctorCinPic")
            this.cinPic = true;
          else if (imageName == this.doctorGet.userId + "doctorMedicalClinicPic")
            this.medicalClinicPic = true;
          else if (imageName == this.doctorGet.userId + "doctorMedicalSpecialty")
            this.medicalSpecialtyPic = true;
        }
      }
    );
  }

  toNotApprovedSection() {
    document.getElementById("notApprovedSection").scrollIntoView({ behavior: "smooth" });
  }

  toGeneralInfoSection() {
    document.getElementById("generalInfoSection").scrollIntoView({ behavior: "smooth" });
  }

  toapprovedByAdminSection() {
    document.getElementById("approvedByAdminSection").scrollIntoView({ behavior: "smooth" });
  }

  initializeAccountSettings() {
    this.maxPatientPerDayInformation = this.translate.instant('maxPatientPerDay');
    this.startTimeInformation = this.translate.instant('startTime');
    this.exactAdressInformation = this.translate.instant('exactAdress');
    this.specialityInformation = this.translate.instant('speciality');
    this.appointmentPriceInformation = this.translate.instant('appointmentPrice');
    this.appointmentApproximateDurationInformation = this.translate.instant('appointmentApproximateDuration');
  }

  initializeEditAccountSettigns() {
    this.startTime = this.doctorGet.startTime.toString();
    this.exactAdress = this.doctorGet.exactAddress;
    this.maxPatientPerDay = this.doctorGet.maxPatientPerDay.toString();
    this.appointmentApproximateDuration = this.doctorGet.appointmentApproximateDuration.toString();
    this.appointmentPrice = this.doctorGet.appointmentPrice.toString();
    if (this.doctorGet.workDays != null) {
      if (this.doctorGet.workDays.indexOf('Mon') != -1)
        this.Mon = true;
      if (this.doctorGet.workDays.indexOf('Tue') != -1)
        this.Tue = true;
      if (this.doctorGet.workDays.indexOf('Wed') != -1)
        this.Wed = true;
      if (this.doctorGet.workDays.indexOf('Thu') != -1)
        this.Thu = true;
      if (this.doctorGet.workDays.indexOf('Fri') != -1)
        this.Fri = true;
      if (this.doctorGet.workDays.indexOf('Sat') != -1)
        this.Sat = true;
      if (this.doctorGet.workDays.indexOf('Sun') != -1)
        this.Sun = true;
    }
  }

  compareMaxPateintPerDay() {
    if (this.doctorGet.maxPatientPerDay.toString() != this.maxPatientPerDay)
      this.disabledUpdateBtn = false;
    else
      this.disabledUpdateBtn = true;
  }

  compareStartTime() {
    if (this.doctorGet.startTime.toString() != this.startTime)
      this.disabledUpdateBtn = false;
    else
      this.disabledUpdateBtn = true;
  }

  compareExactAdress() {
    if (this.doctorGet.exactAddress != this.exactAdress)
      this.disabledUpdateBtn = false;
    else
      this.disabledUpdateBtn = true;
  }

  compareMon() {
    if (this.Mon == true) {
      if (this.doctorGet.workDays.indexOf('Mon') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Mon') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareTue() {
    if (this.Tue == true) {
      if (this.doctorGet.workDays.indexOf('Tue') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Tue') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareWed() {
    if (this.Wed == true) {
      if (this.doctorGet.workDays.indexOf('Wed') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Wed') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareThu() {
    if (this.Thu == true) {
      if (this.doctorGet.workDays.indexOf('Thu') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Thu') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareFri() {
    if (this.Fri == true) {
      if (this.doctorGet.workDays.indexOf('Fri') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Fri') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareSat() {
    if (this.Mon == true) {
      if (this.doctorGet.workDays.indexOf('Sat') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Sat') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareSun() {
    if (this.Sun == true) {
      if (this.doctorGet.workDays.indexOf('Sun') == -1)
        this.disabledUpdateBtn = false;
      else
        this.disabledUpdateBtn = true;
    } else {
      if (this.doctorGet.workDays.indexOf('Sun') == -1)
        this.disabledUpdateBtn = true;
      else
        this.disabledUpdateBtn = false;
    }
  }

  compareAppointmenTime() {
    if (parseInt(this.appointmentApproximateDuration) != this.doctorGet.appointmentApproximateDuration) {
      this.disabledUpdateBtn = false;
    } else {
      this.disabledUpdateBtn = true;
    }
  }

  compareAppointmentPrice() {
    if (parseInt(this.appointmentPrice) != this.doctorGet.appointmentPrice) {
      this.disabledUpdateBtn = false;
    } else {
      this.disabledUpdateBtn = true;
    }
  }

  toreVerifySection() {
    document.getElementById("reVerifySection").scrollIntoView({ behavior: "smooth" });
  }

  reVerifyDoctorDocuments() {
    this.twoStringsPost = new TwoStringsPost(localStorage.getItem('secureLogin'), 'reVerify');
    this.doctorService.changeDoctorStatusBySecureLogin(this.twoStringsPost).subscribe(
      res => {
        if (res) {
          this.getDoctorInfo();
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

  deleteAccount() {
    this.doctorService.deteleDoctorById(this.doctorGet.userId).subscribe(
      res => {
        if (res == 1) {
          localStorage.setItem('secureLogin', '');
          localStorage.setItem('id', '');
          localStorage.setItem('secureLoginType', '');
          this.toastr.warning(this.translate.instant('accountDeleted'), this.translate.instant('delete'), {
            timeOut: 10000,
            positionClass: 'toast-bottom-left'
          });
        }
      }
    );
  }

  getAllSpecialities() {
    this.specialityService.getSpecialities().subscribe(
      res => {
        this.specialityGet = res;
      },
      err => {
        this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
          timeOut: 5000,
          positionClass: 'toast-bottom-left'
        });
      }
    );
  }

  getPatientNumber(date: string, status: string) {
    this.appointmentService.getAppointmentNumberByDoctorIdAndDate(this.doctorGet.userId, date).subscribe(
      res => {
        if (res > 0) {
          if (status == 'today')
            this.todayPatientNumber = res;
          else if (status == 'tomorrow')
            this.tomorrowPatientNumber = res;
        }
      }
    );
  }

  getTodayAppPatientByDate(firstTime: boolean) {
    if (!this.todayAppCharged) {
      let docTodayAppointments: AppointmentGet[] = [];
      this.appointmentService.getAppointmentByDoctorIdAndDate(this.doctorGet.userId, this.todayAppPage, 6, this.currentDate).subscribe(
        res => {
          docTodayAppointments = res;
          if (firstTime) {
            this.patientStart = -docTodayAppointments.length;
            this.patientFinish = 0;
          }
          for (let todayApp of docTodayAppointments) {
            this.docTodayAppointments.push(todayApp);
            this.getPatientInfo(todayApp.patientId, todayApp.patientTurn, 'today');
            this.getPatientProfileImage(todayApp.patientId, todayApp.patientTurn, 'today');
          }
          if (docTodayAppointments.length == 6) {
            this.showpatientNavigationRight = true;
            this.patientStart += 6;
            this.patientFinish += 6;
          }
          else {
            this.showpatientNavigationRight = false;
            this.patientStart += docTodayAppointments.length;
            this.patientFinish += docTodayAppointments.length;
            this.todayAppCharged = true;
          }
          this.todayAppPage += 1;
        }
      );
    } else {
      if (this.docTodayAppointments.length >= (this.patientFinish + 6)) {
        this.patientStart += 6;
        this.patientFinish += 6;
        this.showpatientNavigationLeft = true;
        this.showpatientNavigationRight = true;
      } else {
        this.patientStart += (this.docTodayAppointments.length % 6);
        this.patientFinish += (this.docTodayAppointments.length % 6);
        this.showpatientNavigationRight = false;
        this.showpatientNavigationLeft = true;
      }
    }
    if (!firstTime)
      this.showpatientNavigationLeft = true;
    else {
      if (this.docTodayAppointments.length <= 6)
        this.showpatientNavigationLeft = false;
    }
  }

  getTomorrowAppPatientByDate(firstTime: boolean) {
    if (!this.tomorrowAppCharged) {
      let today = new Date();
      let tomorrow = formatDate(new Date(today.setDate(today.getDate() + 1)), 'yyyy/MM/dd', 'en');
      let tomorrowAppointments: AppointmentGet[] = [];
      this.appointmentService.getAppointmentByDoctorIdAndDate(this.doctorGet.userId, this.tomorrowAppPage, 6, tomorrow).subscribe(
        res => {
          tomorrowAppointments = res;
          if (firstTime) {
            this.patientTomorrowStart = -tomorrowAppointments.length;
            this.patientTomorrowFinish = 0;
            this.getPatientNumber(tomorrow, 'tomorrow');
          }
          for (let tomorrowApp of tomorrowAppointments) {
            this.docTomorrowAppointments.push(tomorrowApp);
            this.getPatientInfo(tomorrowApp.patientId, tomorrowApp.patientTurn, 'tomorrow');
            this.getPatientProfileImage(tomorrowApp.patientId, tomorrowApp.patientTurn, 'tomorrow');
          }
          if (tomorrowAppointments.length == 6) {
            this.showTomorrowpatientNavigationRight = true;
            this.patientTomorrowStart += 6;
            this.patientTomorrowFinish += 6;
          }
          else {
            this.showTomorrowpatientNavigationRight = false;
            this.patientTomorrowStart += tomorrowAppointments.length;
            this.patientTomorrowFinish += tomorrowAppointments.length;
            this.tomorrowAppCharged = true;
          }
          this.tomorrowAppPage += 1;
        }
      );
    } else {
      if (this.docTomorrowAppointments.length >= (this.patientTomorrowFinish + 6)) {
        this.patientTomorrowStart += 6;
        this.patientTomorrowFinish += 6;
        this.showTomorrowpatientNavigationLeft = true;
        this.showTomorrowpatientNavigationRight = true;
      } else {
        this.patientTomorrowStart += (this.docTomorrowAppointments.length % 6);
        this.patientTomorrowFinish += (this.docTomorrowAppointments.length % 6);
        this.showTomorrowpatientNavigationRight = false;
        this.showTomorrowpatientNavigationLeft = true;
      }
    }
    if (!firstTime)
      this.showTomorrowpatientNavigationLeft = true;
    else {
      if (this.docTodayAppointments.length <= 6)
        this.showTomorrowpatientNavigationLeft = false;
    }
  }

  patientNavigationLeftClick() {
    if (this.toadyAppointmentPatientInfo.length >= (this.patientFinish + 6)) {
      this.patientStart -= 6;
      this.patientFinish -= 6;
      this.showpatientNavigationLeft = true;
      this.showpatientNavigationRight = true;
    } else {
      this.patientStart -= (this.toadyAppointmentPatientInfo.length % 6);
      this.patientFinish -= (this.toadyAppointmentPatientInfo.length % 6);
      this.showpatientNavigationRight = true;
      this.showpatientNavigationLeft = false;
    }
  }

  patientTomorrowNavigationLeftClick() {
    if (this.tomorrowAppointmentPatientInfo.length >= (this.patientTomorrowFinish + 6)) {
      this.patientTomorrowStart -= 6;
      this.patientTomorrowFinish -= 6;
      this.showTomorrowpatientNavigationLeft = true;
      this.showTomorrowpatientNavigationRight = true;
    } else {
      this.patientTomorrowStart -= (this.tomorrowAppointmentPatientInfo.length % 6);
      this.patientTomorrowFinish -= (this.tomorrowAppointmentPatientInfo.length % 6);
      this.showTomorrowpatientNavigationRight = true;
      this.showTomorrowpatientNavigationLeft = false;
    }
  }

  showFullPatientTomorrowInfo(medicalProfileId: number, patientKey: number) {
    this.tomorrowPatientKey = patientKey;
    if (this.tomorrowPatientMedicalProfileGet[patientKey] == null) {
      this.patientService.getPatientMedicalProfileByMedicalProfileId(medicalProfileId).subscribe(
        res => {
          if (res) {
            this.tomorrowPatientMedicalProfileGet[patientKey] = res;
            this.tomorrowPatientInfo = true;
            this.tomorrowPatientMedicalProfileGet[patientKey].medicalProfileDisease = [];
            this.getMedicalProfileDiseases(medicalProfileId, patientKey, 'tomorrow');
          }
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    } else {
      this.tomorrowPatientInfo = true;
    }
  }

  getPatientInfo(patientId: number, patientTurn, status: string) {
    this.doctorService.getAppPatientInfoById(patientId).subscribe(
      res => {
        if (res) {
          if (status == 'today') {
            this.toadyAppointmentPatientInfo[patientTurn - 1] = res;
          } else if (status == 'tomorrow') {
            this.tomorrowAppointmentPatientInfo[patientTurn - 1] = res;
          }
        }
      });
  }

  getPatientProfileImage(id: number, turn: number, status: string) {
    let retrieveResonse: any;
    let base64Data: any;
    let retrievedImage: any;
    this.doctorService.getDoctorPofilePhoto(id + 'patientProfilePic').subscribe(
      res => {
        if (status == 'today') {
          if (res != null) {
            retrieveResonse = res;
            base64Data = retrieveResonse.picByte;
            retrievedImage = 'data:image/jpeg;base64,' + base64Data;
            this.patientTodayProfilePic[turn - 1] = retrievedImage;
          } else {
            this.patientTodayProfilePic[turn - 1] = false;
          }
        } else if (status == 'tomorrow') {
          if (res != null) {
            retrieveResonse = res;
            base64Data = retrieveResonse.picByte;
            retrievedImage = 'data:image/jpeg;base64,' + base64Data;
            this.patientTomorrowProfilePic[turn - 1] = retrievedImage;
          } else {
            this.patientTomorrowProfilePic[turn - 1] = false;
          }
        }
      }
    );
  }

  icreasePatientTurn(key: string): string {
    return parseInt(key) + 1 + '';
  }

  showFullPatientInfo(medicalProfileId: number, patientKey: number) {
    this.patientKey = patientKey;
    if (this.todayPatientMedicalProfileGet[patientKey] == null) {
      this.patientService.getPatientMedicalProfileByMedicalProfileId(medicalProfileId).subscribe(
        res => {
          if (res) {
            this.todayPatientMedicalProfileGet[patientKey] = res;
            this.todayPatientMedicalProfileGet[patientKey].medicalProfileDisease = [];
            this.patientInfo = true;
            this.getMedicalProfileDiseases(medicalProfileId, patientKey, 'today');
          }
        },
        err => {
          this.toastr.warning(this.translate.instant('checkCnx'), this.translate.instant('cnx'), {
            timeOut: 5000,
            positionClass: 'toast-bottom-left'
          });
        }
      );
    } else {
      this.patientInfo = true;
    }
  }

  getMedicalProfileDiseases(id: number, patientKey: number, status: string) {
    this.patientService.getPatientMedicalProfileDeseasesByMedicalProfileId(id, 0, 3).subscribe(
      res => {
        this.loadingCurrentPatientInfo = false;
        if (status == 'today')
          this.todayPatientMedicalProfileGet[patientKey].medicalProfileDisease = res;
        else if (status == 'tomorrow')
          this.tomorrowPatientMedicalProfileGet[patientKey].medicalProfileDisease = res;
        else if (status == 'currentPatient')
          this.currentPatientMedicalProfileDiseases[patientKey - 1].medicalProfileDisease = res;
      }
    );
  }

  getPatientByTurn(firsttime: boolean) {
    this.loadingCurrentPatientInfo = true;
    let patientTurn: number;
    if (firsttime)
      patientTurn = this.doctorGet.currentPatient;
    else
      patientTurn = parseInt(this.doctorGet.currentPatient.toString()) + 1;
    this.doctorService.changeCurrentPatientBySecureLogin(localStorage.getItem('secureLogin'), patientTurn).subscribe(
      res => {
        if (res) {
          let nextPatient: number = parseInt(patientTurn.toString()) + 1;
          this.doctorGet.currentPatient = patientTurn;
          if (this.currentPatientInfo[patientTurn - 1] == null)
            this.getAppPatientInfoByDoctorIdTurnAndDate(patientTurn);
          if (nextPatient <= this.todayPatientNumber)
            this.getAppPatientInfoByDoctorIdTurnAndDate(nextPatient);
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

  getAppPatientInfoByDoctorIdTurnAndDate(patientTurn: number) {
    this.doctorService.getAppPatientInfoByDoctorIdTurnAndDate(this.doctorGet.userId, patientTurn, this.currentDate).subscribe(
      res => {
        this.currentPatientInfo[patientTurn - 1] = res;
        this.getCurrentPatientProfileImg(this.currentPatientInfo[patientTurn - 1].userId, patientTurn);
        this.getCurrentPatientMedicalProfile(this.currentPatientInfo[patientTurn - 1].medicalProfileId, patientTurn);
      }
    );
  }

  getCurrentPatientMedicalProfile(medicalProfileId: number, patientTurn: number) {
    this.patientService.getPatientMedicalProfileByMedicalProfileId(medicalProfileId).subscribe(
      res => {
        if (res) {
          this.currentPatientMedicalProfile[patientTurn - 1] = res;
          this.currentPatientMedicalProfile[patientTurn - 1].medicalProfileDisease = [];
          this.getMedicalProfileDiseases(medicalProfileId, patientTurn, 'currentPatient');
        }
      }
    );
  }

  getCurrentPatientProfileImg(id: number, patientTurn: number) {
    let retrieveResonse: any; let base64Data: any; let retrievedImage: any;
    this.doctorService.getDoctorPofilePhoto(id + 'patientProfilePic').subscribe(
      res => {
        if (res != null) {
          retrieveResonse = res;
          base64Data = retrieveResonse.picByte;
          retrievedImage = 'data:image/jpeg;base64,' + base64Data;
          this.currentPatientProfileImg[patientTurn - 1] = retrievedImage;
        } else
          this.currentPatientProfileImg[patientTurn - 1] = false;
      }
    );
  }

  getAppPatientInfo() {
    /*let 
    for (let app of this.doctorGet.appointment) {
      if (app.appointmentDate == this.currentDate) {
        this.patientService.getAppPatientInfoById(app.patientId).subscribe(
          res => {
            if (res) {
              this.toadyAppointmentPatientInfo[app.patientTurn - 1] = res;
              this.getPatientTodayProfileImage(app.patientId, app.patientTurn);
              if (this.toadyAppointmentPatientInfo.length <= 6 && !this.lengthTested) {
                this.showpatientNavigationRight = false;
                this.showpatientNavigationLeft = false;
              } else if (this.toadyAppointmentPatientInfo.length > 6 && !this.lengthTested) {
                this.showpatientNavigationRight = true;
                this.showpatientNavigationLeft = false;
                this.lengthTested = true;
              }
            }
          }
        );
      } else if (app.appointmentDate == tomorrow) {
        this.patientService.getAppPatientInfoById(app.patientId).subscribe(
          res => {
            if (res) {
              this.tomorrowAppointmentPatientInfo[app.patientTurn - 1]=res;
              this.getPatientTomorrowProfileImage(app.patientId, app.patientTurn);
              if (this.tomorrowAppointmentPatientInfo.length <= 6 && !this.tommorowLengthTested) {
                this.showTomorrowpatientNavigationRight = false;
                this.showTomorrowpatientNavigationLeft = false;
              } else if (this.tomorrowAppointmentPatientInfo.length > 6 && !this.tommorowLengthTested) {
                this.showTomorrowpatientNavigationRight = true;
                this.showTomorrowpatientNavigationLeft = false;
                this.tommorowLengthTested = true;
              }
            }
          }
        );
      } else if (app.appointmentStatus == 'completed') {
        this.patientService.getAppPatientInfoById(app.patientId).subscribe(
          res => {
            if (res) {
              this.completedAppointmentPatientInfo.push(res);
            }
          }
        );
      } else {
        this.patientService.getAppPatientInfoById(app.patientId).subscribe(
          res => {
            if (res) {
              this.nextAppointmentPatientInfo.push(res);
            }
          }
        );
      }
    }
  }
  
  getPatientTomorrowProfileImage(id: number, turn: number) {
    let retrieveResonse: any;
    let base64Data: any;
    let retrievedImage: any;
    this.doctorService.getDoctorPofilePhoto(id + 'patientProfilePic').subscribe(
      res => {
        if (res != null) {
          retrieveResonse = res;
          this.patientTomorrowProfilePicRes[turn - 1] = retrieveResonse;
          base64Data = retrieveResonse.picByte;
          retrievedImage = 'data:image/jpeg;base64,' + base64Data;
          this.patientTomorrowProfilePic[turn - 1] = retrievedImage;
        } else {
          this.patientTomorrowProfilePicRes[turn - 1] = null;
          this.patientTomorrowProfilePic[turn - 1] = null;
        }
      }
    );
  }
  patientNavigationRightClick() {
    
  }
  patientTomorrowNavigationRightClick() {
    if (this.tomorrowAppointmentPatientInfo.length >= (this.patientTomorrowFinish + 3)) {
      this.patientTomorrowStart += 3;
      this.patientTomorrowFinish += 3;
      this.showTomorrowpatientNavigationLeft = true;
      this.showTomorrowpatientNavigationRight = true;
    } else {
      this.patientTomorrowStart += (this.tomorrowAppointmentPatientInfo.length % 3);
      this.patientTomorrowFinish += (this.tomorrowAppointmentPatientInfo.length % 3);
      this.showTomorrowpatientNavigationRight = false;
      this.showTomorrowpatientNavigationLeft = true;
    }
  }
 
    
  }
  */
  }
  getDoctorSpecialities() {
    this.doctorService.getDoctorSpecialitiesBySecureLogin(this.secureLogin).subscribe(
      res => {
        this.doctorSpecialities = res;
      }
    );
  }
}