import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { NodeService } from '../../service/node.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  hidePassword: boolean = false;
  passwordForm: FormGroup;

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private node: NodeService) {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required] // Add the 'confirmPassword' control here
    }, { validators: this.passwordMatchValidator() });
  }

  ngOnInit() {}

  showHidePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  checkPasswordMatch(): void {
    const newPassword = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
  
    if (newPassword !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      this.passwordForm.get('confirmPassword')?.setErrors(null);
    }
  }
  
  // Custom validator function to check if newPassword and confirmPassword match
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const newPassword = control.get('password') as FormControl;
      const confirmPassword = control.get('confirmPassword') as FormControl;

      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true }); // Set error at the control level
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null); // Clear error if passwords match
        return null;
      }
    };
  }

  // Rest of your component code

  updatePassword(): void {
    if (this.passwordForm.valid) {
      const oldPassword = this.passwordForm.get('oldPassword')?.value;
      const newPassword = this.passwordForm.get('password')?.value;
      this.node.updatePassword(oldPassword, newPassword).subscribe(
        (response) => {
          // Handle success, e.g., show a success message
        },
        (error) => {
          if(error.statusCode == 403){
            console.log("Old password is incorrect");
          }
        }
      );
    } else {
      // Form is not valid, handle accordingly
    }
  }
}
