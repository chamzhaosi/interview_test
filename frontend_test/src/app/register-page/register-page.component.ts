import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel} from '@angular/forms';
import { StartsWithAlphabetDirective } from '../validators/startwithalphabet.validators';
import { NoSpaceIncludeDirective } from '../validators/nospace.validators';
import { NoNumberIncludeDirective } from '../validators/nonumber.validators copy';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, StartsWithAlphabetDirective, NoSpaceIncludeDirective, NoNumberIncludeDirective],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  hasUpperCase:boolean = false;
  hasLowerCase:boolean = false;
  hasDigit:boolean = false;
  hasSpecialChar:boolean = false;
  hasFiveLen:boolean = false;
  isPasswordMatch:boolean = false;
  isPasswordValid:boolean = false;

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
  
  getValue(value:NgModel){
    // Check password 

    console.log(value.value)


  }

  onSubmit(register_form:NgForm) {
    console.log(register_form)
  }
}
