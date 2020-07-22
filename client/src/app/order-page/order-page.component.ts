import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {

  isRoot: boolean = true;
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;

  constructor(private router: Router,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  openModal() {
    this.modal.open();
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.modal.close();
  }
}
