import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {
  unsubscriber = new Subject();
  isRoot = true;
  @ViewChild('modal') modalRef: ElementRef;
  modal: MaterialInstance;
  loading = false;

  constructor(private router: Router,
              private ordersService: OrdersService,
              private order: OrderService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  openModal() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.loading = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.ordersService.create(order)
      .pipe(
        finalize(() => {
          this.modal.close();
          this.loading = false;
        }),
        takeUntil(this.unsubscriber)
      )
      .subscribe(
        newOrder => {
          MaterialService.toast(`Your order №${newOrder.order} has been added`);
          this.order.clear();
        },
        error => MaterialService.toast(error.error.message));
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
