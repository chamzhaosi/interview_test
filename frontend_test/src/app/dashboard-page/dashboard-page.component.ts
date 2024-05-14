import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RegisterPageComponent, NgIf, NgClass, FormsModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {

  title:string = "Update your data"
  updateBG:string = "#503C3C"
  
  showDoubleConfirmModel:boolean = true;
  username!:string;
  email!:string;
  fullname!:string;
  phonenumber!:string;
  user!:User
  
  constructor(private userService:UsersService, private router:Router){}
  @ViewChild('myModal') myModal!:ElementRef;

  ngOnInit(): void {
    this.userService.getUserData('dashboard').subscribe({
      next:(response:any) => {

        this.username = response.body["client_info"]['username']
        this.email = response.body["client_info"]['email']
        this.fullname = response.body["client_info"]['name']
        this.phonenumber = response.body["client_info"]['phone_number']
      },

      error:(error)=>{
        this.router.navigate(['/login'])
      }
    })
  }

  onChildFormUpdate(updateForm:NgForm) {
    console.log(updateForm.value);
    this.myModal.nativeElement.click();;
  }

  onChildFormDelete() {
    console.log("User Want to delete");
    this.myModal.nativeElement.click();
  }

  onLogout(){
    this.userService.postLogout('logout').subscribe({
      next:(reponses)=>{
        this.router.navigate(['/login'])
      }
    })
  }

  onSubmit(updateForm:NgForm){
    console.log(updateForm.value)
  }
}
