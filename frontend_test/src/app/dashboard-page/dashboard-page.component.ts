import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RegisterPageComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {

  title:string = "Update your data"
  

  username!:string;
  email!:string;
  fullname!:string;
  phonenumber!:string;
  user!:User
  
  constructor(private userService:UsersService, private router:Router){}
  
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
    // Handle form submission here
  }

  onChildFormDelete() {
    console.log("User Want to delete");
    // Handle form submission here
  }

}
