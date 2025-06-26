  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterModule } from '@angular/router';
  import { UserService } from '../../services/user';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule,RouterModule],
    standalone:true,
    templateUrl: './register.html',
    styleUrl: './register.css'
  })
  export class Register {
    form: FormGroup 
    
    
    constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
      this.form = this.fb.group({
        username: ['', [Validators.required,Validators.minLength(3)]],
        firstName: ['', [Validators.required,Validators.minLength(3)]],
        lastName: ['', [Validators.required,Validators.minLength(3)]],
        birthDate: ['', Validators.required],
        stack: ['', Validators.required],
        experience: ['', Validators.required]
      });
      
    }


 onSubmit() {
  if (this.form.invalid) return;

  console.log('Form values:', this.form.value);

  this.userService.register(this.form.value).subscribe({
    next: (res) => {
      this.router.navigate(['/login'], {
        queryParams: { username: this.form.value.username }
      });
    },
    error: (error) => {
      if (error.status === 409) {
        alert('User already exists!');
      } else {
        console.error('Registration error:', error);
        alert('Something went wrong!');
      }
    }
  });
}

}


  
