import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';

enum SortOrder {
  Ascending = "asc",
  Descending = "desc"
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RegisterPageComponent, NgIf, NgClass, FormsModule, NgFor],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit{

  isAdminView!:boolean

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

  users: User[] = [];
  total:number = 0
  previousLink:string =""
  nextLink:string =""
  previousAvailable!:boolean
  nextAvailable!:boolean
  orderType!:'asc' | 'desc'

  eachColumnOrderStatus: { [name: string]: SortOrder } = {}
  constructor(private userService:UsersService, private router:Router){}

  @ViewChild('myModal') myModal!:ElementRef;
  @ViewChild('closeBtnModal') closeBtnModal!:ElementRef;

ngOnInit(): void {
  this.userService.getUserData('dashboard').subscribe({
    next: (response:any) => {
      if (!response.body["count"]){
        this.username = response.body["client_info"]['username']
        this.email = response.body["client_info"]['email']
        this.fullname = response.body["client_info"]['name']
        this.phonenumber = response.body["client_info"]['phone_number']
        this.isAdminView = false
      }else{
        this.previousLink = response.body.previous;
        this.nextLink = response.body.next;
        this.users = response.body.results;
        this.total = response.body.count;
        this.checkPageStatus()
        this.isAdminView = true
      }
    },

    error:(error)=>{
      this.router.navigate(['/login'])
    }
  })
}

  onClickColumnHeader(head_column:HTMLTableCellElement){
    const headerText = head_column.textContent?.trim().toLowerCase();
    if (headerText) {
      // Map from header text to property names
      const headerMap: { [key: string]: keyof User } = {
        'username': 'username',
        'full name': 'fullname',
        'email': 'email',
        'phone number': 'phone_number',
        'active': "active"
      };
      
      const property = headerMap[headerText];

      // if the key exist then do clear the variable, only other key is comming just clear the variable
      if (!(property in this.eachColumnOrderStatus)){
        this.eachColumnOrderStatus = {}
      }

      // if undefined then ascending, else descending
      if (this.eachColumnOrderStatus[property] === 'asc'){
        this.eachColumnOrderStatus[property] = SortOrder.Descending
      }else{
        this.eachColumnOrderStatus[property] = SortOrder.Ascending
      }

      if (property) {
        this.sortUsersByProperty(this.users, property, this.eachColumnOrderStatus[property]);
      } else {
        console.error('Invalid column header for sorting:', headerText);
      }
    }
  }

  sortUsersByProperty(users: User[], property: keyof User, order: 'asc' | 'desc' = 'asc'): void {
    users.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
  
      // Sorting strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' ? valueA.localeCompare(valueB, undefined, { sensitivity: 'base' }) : valueB.localeCompare(valueA, undefined, { sensitivity: 'base' });
      }
  
      // Sorting booleans (true values are considered 'greater')
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return order === 'asc' ? (valueA === valueB ? 0 : valueA ? -1 : 1) : (valueA === valueB ? 0 : valueA ? 1 : -1);
      }
  
      return 0;
    });
  }
  
  getUsers(para:string): void {
    this.userService.getAllUserData("dashboard",para).subscribe({
      next:(response:any)=>{
        this.previousLink = response.body.previous;
        this.nextLink = response.body.next;
        this.users = response.body.results;
        this.total = response.body.count;
        this.checkPageStatus()
      }
    });
  }

  checkPageStatus(){
    if (this.previousLink != null){
      this.previousAvailable = true
    }else{
      this.previousAvailable = false
    }

    if (this.nextLink != null){
      this.nextAvailable = true
    }else{
      this.nextAvailable = false
    }
  }

  previousBtn(){
    this.getUsers(this.previousLink.split('?')[1]);
  }

  nextBtn(){
    this.getUsers(this.nextLink.split('?')[1])
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
