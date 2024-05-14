import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, OnDestroy, Input, AfterContentChecked} from '@angular/core';
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
export class RegisterPageComponent implements  AfterContentChecked, OnDestroy {
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
  isUsernameInputEmpty:boolean = false;
  isEmailInputEmpty:boolean = false;
  isFullnameInputEmpty:boolean = false;
  isPhoneNumberInputEmpty:boolean = false;
  isPasswordInputEmpty:boolean = false;
  isConfirmPasswordInputEmpty:boolean = false;
  isShowPasswordInput:boolean = true;

  constructor(private userService: UsersService, private websocketService: WebsocketService, private router: Router){
  }

  @Input() bgColor: string = "#5C5470"
  @Input() dashboardTitle: string = "";
  @Input() updateMessage: string = "";
  @Input() updateStatus: string = "";
  @Input() dbUsername: string = "";
  @Input() dbEmail: string = "";
  @Input() dbFullname: string = "";
  @Input() dbPhonenumber: string = "";
  @Output() formSubmitted: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  @Output() formDeleted: EventEmitter<null> = new EventEmitter<null>();
  @Output() btnLogout: EventEmitter<null> = new EventEmitter<null>();

  ngAfterContentChecked(): void {
    this.userName = this.dbUsername
    this.userEmail = this.dbEmail
    this.userFullname = this.dbFullname
    this.userPhoneNumber = this.dbPhonenumber
  }
  
  // let dashboard handle the submission
  handleDelete(){
    this.formDeleted.emit();
  }
  
    // let dashboard handle the submission
  handleUpdate(updateForm:NgForm) {
    // Emit an event when the form is submitted
    this.formSubmitted.emit(updateForm);
  }

    // let dashboard handle the submission
  handleLogout(){
    this.btnLogout.emit()
  }

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

    if (this.isUsernameInputEmpty  && input.name === "username"){
      this.isUsernameInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (this.emailExists && input.name === "email"){
      this.emailExists = this.newUser.email != input.value ? false : true
    }

    if (this.isEmailInputEmpty && input.name === "email"){
      this.isEmailInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (this.isFullnameInputEmpty && input.name === "fullname"){
      this.isFullnameInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (this.isPhoneNumberInputEmpty && input.name === "phone_number"){
      this.isPhoneNumberInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (this.isPasswordInputEmpty && input.name === "password"){
      this.isPasswordInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (this.isConfirmPasswordInputEmpty && input.name === "confirm_password"){
      this.isConfirmPasswordInputEmpty = input.value.trim() != "" ? false : true 
    }

    if (input.name === "changsPasswordCheck"){
      this.isShowPasswordInput = input.value;
      this.reset() // password checking
    }
  }

  onSubmit(register_form:NgForm) {

    if (!this.isAnyInputEmpty(register_form) 
      // && !this.isInvalidUsername(register_form.value.username) 
      // && !this.isInvalidEmail(register_form.value.email) 
      // && !this.isInvalidFullname(register_form.value.fullname) 
      // && !this.isInvalidPhonenumber(register_form.value.phone_number) 
      // && !this.isInvalidPassword(register_form.value.password) 
      // && !this.isMatchPassword(register_form.value.password, register_form.value.confirm_password)
    )
      {
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

                  this.ngOnDestroy()
                  // if successfully create an account then redirect to login page
                  this.router.navigate(['/login'])
                }else{
  
                  // else show the error message and add is-invalid class to the related input
                  this.showMessageColor = "danger"
                  this.registerRemark = this.formatErrorMessage(result.remark)
                  
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
  }

  formatErrorMessage(errorString:string):string{
    console.log(errorString.split(":").length)
    if (errorString.split(":").length > 1){
      let error_list:string[] = [];

      const errors = errorString.split('. ').filter(Boolean); // Split by '. ' and remove empty entries

      errors.forEach(element => {
        error_list.push(element.split(":")[1])
      });

      const formattedErrors = error_list.map(error => {
        // Capitalize the first letter and ensure proper punctuation
        return error.charAt(0).toUpperCase() + error.slice(1) + (error.endsWith('.') ? '' : '.');
      });
      return formattedErrors.join(' ');
    }
    return errorString
  }

  isAnyInputEmpty(register_form:NgForm):boolean{
    if (register_form.value.username.trim() === ""){
      this.isUsernameInputEmpty = true
    }

    if (register_form.value.email.trim() === ""){
      this.isEmailInputEmpty = true
    }

    if (register_form.value.fullname.trim() === ""){
      this.isFullnameInputEmpty = true
    }

    if (register_form.value.phone_number.trim() === ""){
      this.isPhoneNumberInputEmpty = true
    }

    if (register_form.value.password.trim() === ""){
      this.isPasswordInputEmpty = true
    }

    if (register_form.value.confirm_password === undefined || register_form.value.confirm_password.trim() === ""){
      this.isConfirmPasswordInputEmpty = true
    }

    if (
      this.isUsernameInputEmpty ||
      this.isEmailInputEmpty ||
      this.isFullnameInputEmpty ||
      this.isPhoneNumberInputEmpty ||
      this.isPasswordInputEmpty ||
      this.isConfirmPasswordInputEmpty
    ){
      return true
    }

    return false
  }

  // isInvalidUsername(username:string):boolean{
  //   return false
  // }
  
  // isInvalidEmail(email:string):boolean{
  //   return false
  // }

  // isInvalidFullname(fullname:string):boolean{
  //   return false
  // }

  // isInvalidPhonenumber(phone_number:string):boolean{
  //   return false
  // }

  // isInvalidPassword(password:string):boolean{
  //   return false
  // }

  // isMatchPassword(password:string, c_password:string):boolean{
  //   return false
  // }


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

  signIN(){
    this.router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.messagesSubscription?.unsubscribe();
    this.websocketService.close();
  }
}
