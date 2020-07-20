import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { Category, Message } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview;
  category: Category;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.buildForm();
    this.getById();
  }

  buildForm() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
  }

  getById() {
    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id'])
          }
          return of(null)
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )

  }

  onFileUpload(event: any) {
    this.image = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result
    };
    reader.readAsDataURL(this.image)
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category;
        MaterialService.toast(this.isNew ? 'Category has been created' : 'Category has been saved');
        this.form.enable();
        this.goToCategoryList();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
        this.goToCategoryList();
      }
    )
  }

  deleteCategory() {
    const decision = window.confirm(`Do you want to delete category with name "${this.category.name}" ?`);

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          (message: Message) => MaterialService.toast(message.message),
          error => MaterialService.toast(error.error.message),
          () => this.goToCategoryList());
    }
  }

  goToCategoryList() {
    this.router.navigate(['/categories'])
  }

}
