import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Filter, Order } from '../shared/interfaces';
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
  filter: Filter = {};

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

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  getAllOrders() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

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

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter  = filter;

    this.getAllOrders()
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
