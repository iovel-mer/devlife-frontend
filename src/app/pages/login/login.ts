import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports:[CommonModule,ReactiveFormsModule,RouterModule],
  standalone:true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  

  
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
   
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.value.username!;
    this.userService.login(username).subscribe({
      next: (res) => {
        console.log(res);
        
        sessionStorage.setItem('username', res.username);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        alert('User Not Found!')
      }
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }
}
