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

  matchPassword(password:NgModel, c_password:NgModel){
    this.isPasswordMatch = password.value === c_password.value;
  }
  
  // getValue(value:NgModel){
  //   console.log(value.value)
  // }

  i = 0;
  onSubmit(register_form:NgForm) {
    let newUser : User = {
      username : register_form.value.username,
      password : register_form.value.password,
      email : register_form.value.email,
      fullname : register_form.value.fullname,
      phone_number : register_form.value.phone_number,
    }
    
    this.userService.postRegister('register', newUser).subscribe({
      next:(response:any) => {
        if (response.status == 200){

          this.showLoadingPage = true;

          this.messagesSubscription = this.websocketService.getMessages(response.body['task_id']).subscribe({
            next: (message) => {
              let result = JSON.parse(message)
              this.registerStatus = result.status
              
              if (this.registerStatus === "SUCCESS"){
                this.showMessageColor = "success"
                this.registerRemark = result.remark
                this.showMessage = true

                this.router.navigate(['/login'])
              }else{
                this.showMessageColor = "danger"
                this.registerRemark = this.formatErrorMessage(result.remark)
                this.showMessage = true
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

  formatErrorMessage(errorString:string):string{
    const errors = errorString.split('. ').filter(Boolean); // Split by '. ' and remove empty entries
    const formattedErrors = errors.map(error => {
      // Capitalize the first letter and ensure proper punctuation
      return error.charAt(0).toUpperCase() + error.slice(1) + (error.endsWith('.') ? '' : '.');
    });
    return formattedErrors.join('\n');
  }

  ngOnDestroy() {
    this.messagesSubscription?.unsubscribe();
    this.websocketService.close();
  }
}
