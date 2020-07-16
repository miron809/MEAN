import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  unsubscriber = new Subject();

  form: FormGroup;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }

  onSubmit() {
    this.auth.register(this.form.value)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        () => {
          this.router.navigate(['/login'], {
            queryParams: {
              registered: true
            }
          })
        },
        error => {
          MaterialService.toast(error.error.message);
        }
      )
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
