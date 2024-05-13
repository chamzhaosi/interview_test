import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  userName!:string;
  noUsername:boolean = false
  noPassword:boolean = false
  user!:User;
  notFoundError:boolean = false;
  errorMessage:string = "";

  constructor(private userService:UsersService, private router:Router){}

  changeValue(input:NgModel){
    if (input.name === "username" && !(input.value.trim() === "" || input.value === undefined)){
      this.noUsername = false
    }else if(input.name === "username"){
      this.noUsername = true
    }

    if (input.name === "password" && !(input.value.trim() === "" || input.value === undefined)){
      this.noPassword = false
    }else if(input.name === "password"){
      this.noPassword = true
    }
  }

  onSubmit(login_form:NgForm){
    if (login_form.value.username === undefined || login_form.value.username.trim() === ""){
      this.noUsername = true
    }

    if (login_form.value.password === undefined  || login_form.value.password.trim() === ""){
      this.noPassword = true
    }

    if (!this.noUsername && !this.noPassword){
      this.user = {
        username : login_form.value.username,
        password : login_form.value.password
      }
      this.userService.postLogin("login", this.user).subscribe({
        next:(response) => {
          // get the response status code
          let status: number = response.status;

          // if equals 200, then redirest to the dashboard page
          if (status == 200) {
            this.router.navigate([''])
            this.notFoundError = false
          }
        },
        error: (error) => {
          this.errorMessage = "Invalid username or password, Please try again!"
          this.notFoundError = true
        }
      })
    }
  }

}
