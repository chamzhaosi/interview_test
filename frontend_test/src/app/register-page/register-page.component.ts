import { NgClass, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm, NgModel} from '@angular/forms';
import { StartsWithAlphabetDirective } from '../validators/startwithalphabet.validators';
import { NoSpaceIncludeDirective } from '../validators/nospace.validators';
import { NoNumberIncludeDirective } from '../validators/nonumber.validators copy';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, StartsWithAlphabetDirective, NoSpaceIncludeDirective, NoNumberIncludeDirective],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnDestroy {
  messagesSubscription?: Subscription;
  hasUpperCase:boolean = false;
  hasLowerCase:boolean = false;
  hasDigit:boolean = false;
  hasSpecialChar:boolean = false;
  hasFiveLen:boolean = false;
  isPasswordMatch:boolean = false;
  isPasswordValid:boolean = false;
  registerStatus!:string
  registerRemark!:string
  showMessage:boolean = false;
  showMessageColor!:string;
  showLoadingPage:boolean = false;
  usernameExists:boolean = false;
  emailExists:boolean = false;
  newUser!:User;
  userName:string = "";
  userEmail:string = "";
  userFullname:string = "";
  userPhoneNumber:string = "";

  constructor(private userService: UsersService, private websocketService: WebsocketService, private router: Router){}

  checkPasswordFormat(password:NgModel){
    let passwordValue = password.value as string;

    // check uppercase
    if (/[A-Z]/.test(passwordValue)){
      this.hasUpperCase = true;
    }else{
      this.hasUpperCase = false;
    }

    // check lowercase
    if (/[a-z]/.test(passwordValue)){
      this.hasLowerCase = true;
    }else{
      this.hasLowerCase = false;
    }

    // check digit
    if (/[0-9]/.test(passwordValue)){
      this.hasDigit = true;
    }else{
      this.hasDigit = false;
    }

    //check special character
    if (/[^a-zA-z0-9]/.test(passwordValue)){
      this.hasSpecialChar = true;
    }else{
      this.hasSpecialChar = false;
    }

    // check length
    if (passwordValue.length >= 5){
      this.hasFiveLen = true;
    }else{
      this.hasFiveLen = false;
    }

    if ( this.hasUpperCase  && this.hasLowerCase && this.hasDigit && this.hasSpecialChar && this.hasFiveLen){
      this.isPasswordValid = true
    }else{
      this.isPasswordValid = false
    }

  }

  // match will the password
  matchPassword(password:NgModel, c_password:NgModel){
    this.isPasswordMatch = password.value === c_password.value;
  }
  

  // when user get warning about username or email is existing, then is-invalid class will be added to the input
  // only when user type anther username or email then the is-invalid class just will be removed
  changeValue(input:NgModel){
    if (this.usernameExists && input.name === "username"){
      this.usernameExists = this.newUser.username != input.value ? false : true
    }

    if (this.emailExists && input.name === "email"){
      this.emailExists = this.newUser.email != input.value ? false : true
    }
  }

  onSubmit(register_form:NgForm) {
    this.newUser = {
      username : register_form.value.username,
      password : register_form.value.password,
      email : register_form.value.email,
      fullname : register_form.value.fullname,
      phone_number : register_form.value.phone_number,
    }

    this.userService.postRegister('register', this.newUser).subscribe({
      next:(response:any) => {
        if (response.status == 200){

          // Showing the loading page
          this.showLoadingPage = true;

          // Starting connect websocket to received task status
          this.messagesSubscription = this.websocketService.getMessages(response.body['task_id']).subscribe({
            next: (message) => {

              let result = JSON.parse(message)
              this.registerStatus = result.status
              
              if (this.registerStatus === "SUCCESS"){
                // this.showMessageColor = "success"
                // this.registerRemark = result.remark
                // this.showMessage = true

                // if successfully create an account then redirect to login page
                this.router.navigate(['/login'])
              }else{

                // else show the error message and add is-invalid class to the related input
                this.showMessageColor = "danger"
                this.registerRemark = result.remark
                
                if (this.registerRemark.toLowerCase().includes("username"))
                  this.usernameExists = true

                if (this.registerRemark.toLowerCase().includes("email"))
                  this.emailExists = true

                this.showMessage = true
                this.autoFillInData();
                this.reset();
              }

              this.showLoadingPage = false;
            },
            error: (error) => {
              console.error('Error receiving message:', error)
              this.showLoadingPage = false;
            }
          });
        }
      }
    })

    this.ngOnDestroy()
  }

  // Once the form disappear, everything will gone,
  // then this function will auto fillin again part of input value, based on what user previous submitted
  autoFillInData(){
    this.userName = this.newUser.username;
    this.userEmail = this.newUser.email;
    this.userFullname = this.newUser.fullname;
    this.userPhoneNumber = this.newUser.phone_number;
  }

  // let the password checking red again
  reset(){
    this.hasUpperCase = false;
    this.hasLowerCase = false;
    this.hasDigit = false;
    this.hasSpecialChar = false;
    this.hasFiveLen = false;
    this.isPasswordMatch = false;
    this.isPasswordValid = false;
  }

  ngOnDestroy() {
    this.messagesSubscription?.unsubscribe();
    this.websocketService.close();
  }
}
