import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order } from '../shared/interfaces';
import { finalize } from 'rxjs/operators';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {
  isFilterVisible = false;
  oSub: Subscription;
  orders: Order[] = [];

  loading = false;
  reloading = false;
  noMoreOrders = false;

  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: MaterialInstance;

  offset = 0;
  limit = STEP;

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.reloading = true;
    this.getAllOrders();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  getAllOrders() {
    const params = {
      offset: this.offset,
      limit: this.limit
    };

    this.oSub = this.ordersService.getAllOrders(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.reloading = false;
        })
      )
      .subscribe(
        orders => {
          this.orders = this.orders.concat(orders);
          this.noMoreOrders = orders.length < STEP;
        }
      );
  }

  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.getAllOrders();
  }


  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

}
