import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// Interfaces
export interface Country {
  id: string;
  iso2Code: string;
  name: string;
}

export interface Indicator {
  id: string;
  name: string;
}

// --- NEW: Interface for Chart Data ---
export interface ChartDataPoint {
  name: string; // The year
  value: number;
}

export interface ChartSeries {
  name: string; // The indicator name
  series: ChartDataPoint[];
}


@Injectable({
  providedIn: 'root'
})
export class WorldBankService {
  private baseApiUrl = 'https://api.worldbank.org/v2';

  constructor(private http: HttpClient) { }

  getCountries(): Observable<Country[]> {
    const url = `${this.baseApiUrl}/country?format=json&per_page=300`;
    return this.http.get<any[]>(url).pipe(
      map(response => response[1]),
      map((countries: any[]) => countries.filter(country => country.region.value !== 'Aggregates'))
    );
  }

  getIndicators(countryId: string): Observable<Indicator[]> {
    const indicators: Indicator[] = [
        { id: 'SP.POP.TOTL', name: 'Population, Total' },
        { id: 'NY.GDP.MKTP.CD', name: 'GDP (Current US$)' },
        { id: 'FP.CPI.TOTL.ZG', name: 'Inflation (Annual %)' },
        { id: 'SL.UEM.TOTL.ZS', name: 'Unemployment Rate (%)' }
    ];
    return new Observable(observer => {
        observer.next(indicators);
        observer.complete();
    });
  }

  // --- NEW: Function to get data for a specific indicator ---
  getIndicatorData(countryId: string, indicatorId: string): Observable<ChartDataPoint[]> {
    const url = `${this.baseApiUrl}/country/${countryId}/indicator/${indicatorId}?format=json&per_page=50`;
    return this.http.get<any[]>(url).pipe(
      map(response => response[1]),
      // Filter out null values and map to the format ngx-charts expects
      map((dataPoints: any[]) => 
        dataPoints
          .filter(point => point.value !== null)
          .map(point => ({
            name: point.date,
            value: point.value
          }))
          .reverse() // Reverse to show chronological order
      )
    );
  }
}
