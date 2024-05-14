import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RegisterPageComponent, NgIf, NgClass, FormsModule, NgxPaginationModule, NgFor],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {

  isAdminView:boolean = false

  title:string = "Update your data"
  updateBG:string = "#503C3C"
  updateMessage:string = "";
  updateStatus:string = "";
  showDoubleConfirmModel:boolean = true;
  username!:string;
  email!:string;
  fullname!:string;
  phonenumber!:string;
  current_password_input!:string;
  deleteBtnPress!:boolean;
  user!:User;
  uptUser!:User;

  users: any[] = [];
  total = 0;
  page = 1;
  limit = 10;

  constructor(private userService:UsersService, private router:Router){}

  @ViewChild('myModal') myModal!:ElementRef;
  @ViewChild('closeBtnModal') closeBtnModal!:ElementRef;

  ngOnInit(): void {
    this.userService.getUserData('dashboard').subscribe({
      next:(response:any) => {
        if (!response.body["count"]){
          this.username = response.body["client_info"]['username']
          this.email = response.body["client_info"]['email']
          this.fullname = response.body["client_info"]['name']
          this.phonenumber = response.body["client_info"]['phone_number']
        }else{
          this.isAdminView = true
           
          console.log(response.body)
          this.users = response.body.results;
          this.total = response.body.count;

          console.log(this.users)
        }
      },

      error:(error)=>{
        this.router.navigate(['/login'])
      }
    })
  }

  getUsers(page: number, limit: number): void {
    this.userService.getAllUserData("dashboard", page, limit).subscribe({
      next:(response:any)=>{
        console.log(response.body)
        this.users = response.results;
        this.total = response.count;
      }
    });
  }

  onPageChange(page: any): void {
    this.getUsers(page, this.limit);
  }

  onChildFormUpdate(updateForm:NgForm) {
    this.deleteBtnPress = false;
    this.uptUser = {
      username: updateForm.value.username,
      fullname: updateForm.value.fullname,
      email: updateForm.value.email,
      phone_number: updateForm.value.phone_number,
    }

    if (updateForm.value.changsPasswordCheck){
      this.uptUser.password = updateForm.value.password
    }

    this.myModal.nativeElement.click();
  }

  onChildFormDelete() {
    this.deleteBtnPress = true;
    this.myModal.nativeElement.click();
  }

  onLogout(){
    this.userService.postLogout('logout').subscribe({
      next:()=>{
        this.router.navigate(['/login'])
      }
    })
  }

  onSubmit(identifyForm:NgForm){
    if (!this.deleteBtnPress){
      this.uptUser.current_password = identifyForm.value.current_password

      this.userService.updateUserData("update_client", this.uptUser).subscribe({
        next:() => {
          this.updateMessage = "Update successfully!"
          this.updateStatus = "success"
          this.closeBtnModal.nativeElement.click();
          identifyForm.reset();
        },
        error:(error)=>{
          this.updateMessage = ""
          Object.keys(error.error).forEach(key => {
            this.updateMessage += `${error.error[key]}`.charAt(0).toUpperCase() + `${error.error[key]}`.slice(1) + (`${error.error[key]}`.endsWith('.') ? ' ' : '. ')  // Add a newline for each error
          });
          this.updateStatus = "danger"
          this.closeBtnModal.nativeElement.click();
          identifyForm.reset();
        }
      })
    }else{
      this.uptUser = {
        current_password : identifyForm.value.current_password,
        active : false,
      }
      
      this.userService.updateUserData("update_client", this.uptUser).subscribe({
        next:() => {
          this.updateMessage = "Account deleted successfully!"
          this.updateStatus = "success"
          this.closeBtnModal.nativeElement.click();
          identifyForm.reset();
          this.router.navigate(['/login'])
        },
        error:(error)=>{
          this.updateMessage = ""
          Object.keys(error.error).forEach(key => {
            this.updateMessage += `${error.error[key]}`.charAt(0).toUpperCase() + `${error.error[key]}`.slice(1) + (`${error.error[key]}`.endsWith('.') ? ' ' : '. ')  // Add a newline for each error
          });
          this.updateStatus = "danger"
          this.closeBtnModal.nativeElement.click();
          identifyForm.reset();
        }
      })
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
