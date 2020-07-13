import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

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
    this.getQueryParams();
    this.buildForm();
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {

      } else if (params['accessDenied']) {

      }
    })
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
              'registered': true
            }
          })
        },
        error => {
          console.log(error)
        }
      )
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
