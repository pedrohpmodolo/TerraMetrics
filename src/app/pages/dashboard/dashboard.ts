import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, SavedItem } from '../../services/dashboard';
import { WorldBankService, ChartSeries } from '../../services/world-bank';
import { AuthService } from '../../services/auth';
import { AiAnalysisService, ChatMessage } from '../../services/ai-analysis';
import { Observable, map, switchMap, combineLatest, of, forkJoin } from 'rxjs';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

// This interface will hold the fully processed data for our template
export interface DashboardItem {
  savedItem: SavedItem;
  indicators: { name: string, id: string }[]; // List of available indicators
  activeChartData: ChartSeries[] | null; // Data for the currently selected chart
  activeIndicatorName: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  dashboardItems$!: Observable<DashboardItem[]>;
  colorScheme: Color = { name: 'cool', selectable: true, group: ScaleType.Ordinal, domain: ['#5eead4'] };

  isChatLoading = false;
  chatHistory: ChatMessage[] = [];
  chatInput = '';
  private rawSavedItems: SavedItem[] = []; 

  constructor(
    private dashboardService: DashboardService,
    private worldBankService: WorldBankService,
    public authService: AuthService,
    private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    this.dashboardItems$ = this.dashboardService.getUserDashboardItems().pipe(
      map(savedItems => {
        this.rawSavedItems = savedItems;
        return savedItems;
      }),
      switchMap(savedItems => {
        if (savedItems.length === 0) return of([]);
        
        const itemDataObservables = savedItems.map(item => {
          if (item.type === 'country') {
            return this.worldBankService.getIndicators(item.country.id).pipe(
              map(indicators => ({
                savedItem: item,
                indicators: indicators,
                activeChartData: null,
                activeIndicatorName: null
              }))
            );
          } else { // type === 'chart'
            return this.worldBankService.getIndicatorData(item.country.id, item.indicator!.id).pipe(
              map(dataPoints => ({
                savedItem: item,
                indicators: [item.indicator!], // Only one indicator
                activeChartData: [{ name: item.indicator!.name, series: dataPoints }],
                activeIndicatorName: item.indicator!.name
              }))
            );
          }
        });
        return combineLatest(itemDataObservables);
      })
    );
  }

  // --- NEW: Function to load a chart when an indicator pill is clicked ---
  loadChart(item: DashboardItem, indicatorId: string, indicatorName: string) {
    // If this chart is already active, hide it
    if (item.activeIndicatorName === indicatorName) {
      item.activeChartData = null;
      item.activeIndicatorName = null;
      return;
    }

    this.worldBankService.getIndicatorData(item.savedItem.country.id, indicatorId).subscribe(dataPoints => {
      item.activeChartData = [{ name: indicatorName, series: dataPoints }];
      item.activeIndicatorName = indicatorName;
    });
  }

  sendChatMessage() {
    if (!this.chatInput.trim() || this.rawSavedItems.length === 0) return;
    this.chatHistory.push({ role: 'user', content: this.chatInput });
    this.isChatLoading = true;
    const currentMessage = this.chatInput;
    this.chatInput = '';

    this.aiAnalysisService.getDashboardSuggestion(this.rawSavedItems, currentMessage)
      .subscribe({
        next: (response) => {
          this.chatHistory.push({ role: 'assistant', content: response });
          this.isChatLoading = false;
        },
        error: (err) => {
          this.chatHistory.push({ role: 'assistant', content: 'Sorry, I encountered an error.' });
          this.isChatLoading = false;
        }
      });
  }

  deleteItem(itemId: any) {
    if (itemId && confirm('Are you sure you want to remove this item from your dashboard?')) {
      this.dashboardService.deleteDashboardItem(itemId)
        .catch(err => console.error("Error deleting item:", err));
    }
  }
}
