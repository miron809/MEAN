import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

    getOverview() {
      return this.http.get('/api/analytics/overview')
    }

    getAnalytics() {}
}
