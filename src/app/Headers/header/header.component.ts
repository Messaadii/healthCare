import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../../app.component'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private translate: TranslateService,private appComp:AppComponent) { 
    translate.addLangs(['en','fr']);
    /*document.addEventListener('click', this.closeAllMenu.bind(this));*/
  }


  ngOnInit(): void {
  }
  en:boolean=true;
  fr:boolean=false;
  settingsBoxUnder700:boolean=false;
  displaySettingsBox:boolean=false;
  darkMode:boolean=false;

  menuCheckBox:boolean=false;
  headerOnScrollVariable=false;

  @HostListener("document:scroll")
  scroll(){
    if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0){
      this.headerOnScrollVariable=true;
    }else{
      this.headerOnScrollVariable=false;
    }
  }
  toDoctocSection(){
    document.getElementById("doctocSection").scrollIntoView({behavior:"smooth"});
    this.menuCheckBox=false;
  }
  toAcceuilSection(){
    document.getElementById("acceuilSection").scrollIntoView({behavior:"smooth"});
    this.menuCheckBox=false;
  }
  toConnexionSection(){
    document.getElementById("connexionSection").scrollIntoView({behavior:"smooth"});
    this.menuCheckBox=false;
  }
  toMaladiesSection(){
    document.getElementById("maladiesSection").scrollIntoView({behavior:"smooth"});
    this.menuCheckBox=false;
  }
  toAboutSection(){
    document.getElementById("aboutSection").scrollIntoView({behavior:"smooth"});
    this.menuCheckBox=false;
  }
  changeLang(lang:string){
    this.translate.use(lang);
  }

  closeMenu(){
    this.menuCheckBox=false;
  }
  switchTheme(){
    this.appComp.switchTheme();
    if(this.darkMode==false)
     this.darkMode=true;
    else
     this.darkMode=false;
  }
}