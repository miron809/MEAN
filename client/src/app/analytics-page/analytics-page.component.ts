import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {

    const orderConfig: any = {
      label: 'Order',
      color: 'rgb(54,162,235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data) => {
      this.average = data.average;
      this.initGainChart(data);
      this.initOrderChart(data);

      this.pending = false;
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  initGainChart(data) {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(255,99,132)'
    }

    gainConfig.labels = data.chart.map(item => item.label)
    gainConfig.data = data.chart.map(item => item.gain)

    const gainContext = this.gainRef.nativeElement.getContext('2d')
    gainContext.canvas.height = '300px'

    new Chart(gainContext, createChartConfig(gainConfig))
  }

  initOrderChart(data) {
    const orderConfig: any = {
      label: 'Order',
      color: 'rgb(54,162,235)'
    }

    orderConfig.labels = data.chart.map(item => item.label)
    orderConfig.data = data.chart.map(item => item.order)

    const orderContext = this.orderRef.nativeElement.getContext('2d')
    orderContext.canvas.height = '300px'

    new Chart(orderContext, createChartConfig(orderConfig))
  }


}


function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
