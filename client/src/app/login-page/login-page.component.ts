import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit, OnDestroy {
  unsubscriber = new Subject();

  form: FormGroup;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getQueryParams();
    this.buildForm();
  }

  ngAfterViewInit(): void {
    MaterialService.updateTextInputs();
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can sign-in')
      } else if (params['accessDenied']) {
        MaterialService.toast('You must be logged in')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Please sign-in again')
      }
    })
  }

  buildForm() {
    this.form = new FormGroup({
      email: new FormControl('admin@email.com', [Validators.required, Validators.email]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.auth.login(this.form.value)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        () => {
          this.router.navigate(['/overview'])
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
