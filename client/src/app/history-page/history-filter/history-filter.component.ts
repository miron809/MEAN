import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Filter } from '../../shared/interfaces';
import { MaterialDatePicker, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy {

  order: number;
  start: MaterialDatePicker;
  end: MaterialDatePicker;

  isValid = true;

  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;
  @Output() onFilter = new EventEmitter<Filter>();

  ngAfterViewInit() {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }

  ngOnDestroy() {
    this.start.destroy();
    this.end.destroy();
  }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date
  }

  submitFilter() {
    const filter: Filter = {}

    if (this.order) {
      filter.order = this.order
    }

    this.start.date ? filter.start = this.start.date : false;
    this.end.date ? filter.end = this.end.date : false;

    this.onFilter.emit(filter);
  }
}
