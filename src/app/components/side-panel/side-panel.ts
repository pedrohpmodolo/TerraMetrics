import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui';
import { WorldBankService, Country, Indicator, ChartSeries } from '../../services/world-bank';
import { DashboardService } from '../../services/dashboard';
import { Observable, switchMap, of, map, BehaviorSubject, combineLatest } from 'rxjs';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './side-panel.html',
  styleUrls: ['./side-panel.scss']
})
export class SidePanelComponent implements OnInit {
  isPanelOpen$: Observable<boolean>;
  selectedCountry$: Observable<Country | null>;
  indicators$!: Observable<Indicator[]>;
  private searchTerm = new BehaviorSubject<string>('');
  private allCountries$!: Observable<Country[]>;
  filteredCountries$!: Observable<Country[]>;
  selectedIndicator: Indicator | null = null;
  chartData$!: Observable<ChartSeries[]>;
  colorScheme: Color = { name: 'cool', selectable: true, group: ScaleType.Ordinal, domain: ['#2563eb'] };
  saveMessage: string | null = null;

  constructor(
    private uiService: UiService,
    private worldBankService: WorldBankService,
    private dashboardService: DashboardService
  ) {
    this.isPanelOpen$ = this.uiService.isPanelOpen$;
    this.selectedCountry$ = this.uiService.selectedCountry$;
  }

  ngOnInit(): void {
    this.allCountries$ = this.worldBankService.getCountries();
    this.filteredCountries$ = combineLatest([this.allCountries$, this.searchTerm]).pipe(
      map(([countries, term]) => 
        countries.filter(c => c.name.toLowerCase().includes(term.toLowerCase()))
      )
    );
    this.indicators$ = this.selectedCountry$.pipe(
      switchMap(country => country ? this.worldBankService.getIndicators(country.id) : of([]))
    );
  }

  // --- THIS FUNCTION IS NOW CORRECT ---
  // It only updates the UI state and does NOT save to the database.
  selectCountry(country: Country) {
    this.uiService.selectCountry(country);
  }

  saveCountry() {
    this.selectedCountry$.subscribe(country => {
      if (country) {
        this.dashboardService.addCountry(country)
          .then(() => this.showSaveFeedback(`'${country.name}' saved to dashboard!`))
          .catch(err => this.showSaveFeedback('Error saving country.'));
      }
    });
  }

  saveChart() {
    this.selectedCountry$.subscribe(country => {
      if (country && this.selectedIndicator) {
        this.dashboardService.addChart(country, this.selectedIndicator)
          .then(() => this.showSaveFeedback(`'${this.selectedIndicator?.name}' chart saved!`))
          .catch(err => this.showSaveFeedback('Error saving chart.'));
      }
    });
  }

  private showSaveFeedback(message: string) {
    this.saveMessage = message;
    setTimeout(() => this.saveMessage = null, 3000);
  }

  onSearch(event: Event) { this.searchTerm.next((event.target as HTMLInputElement).value); }
  closePanel() { this.uiService.closePanel(); this.selectedIndicator = null; }
  
  selectIndicator(indicator: Indicator) {
    this.selectedIndicator = indicator;
    this.chartData$ = this.selectedCountry$.pipe(
      switchMap(country => {
        if (country && indicator) {
          return this.worldBankService.getIndicatorData(country.id, indicator.id).pipe(
            map(dataPoints => [{ name: indicator.name, series: dataPoints }])
          );
        }
        return of([]);
      })
    );
  }

  goBack() {
    this.uiService.selectCountry(null!);
    this.selectedIndicator = null;
  }
}
