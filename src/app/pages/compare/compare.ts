import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for chat input
import { WorldBankService, Country } from '../../services/world-bank';
import { AiAnalysisService, ChatMessage } from '../../services/ai-analysis';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './compare.html',
  styleUrls: ['./compare.scss']
})
export class CompareComponent implements OnInit {
  private allCountries$!: Observable<Country[]>;

  // State for Country 1 & 2
  private searchTerm1 = new BehaviorSubject<string>('');
  filteredCountries1$!: Observable<Country[]>;
  selectedCountry1: Country | null = null;
  private searchTerm2 = new BehaviorSubject<string>('');
  filteredCountries2$!: Observable<Country[]>;
  selectedCountry2: Country | null = null;

  // State for AI Analysis
  isLoadingAnalysis = false;
  analysisResult: string | null = null;

  // State for Chat
  isChatLoading = false;
  chatHistory: ChatMessage[] = [];
  chatInput = '';

  constructor(
    private worldBankService: WorldBankService,
    private aiAnalysisService: AiAnalysisService
  ) {}

  ngOnInit(): void {
    this.allCountries$ = this.worldBankService.getCountries();
    this.filteredCountries1$ = combineLatest([this.allCountries$, this.searchTerm1]).pipe(
      map(([countries, term]) => this.filterCountries(countries, term, this.selectedCountry2))
    );
    this.filteredCountries2$ = combineLatest([this.allCountries$, this.searchTerm2]).pipe(
      map(([countries, term]) => this.filterCountries(countries, term, this.selectedCountry1))
    );
  }

  analyzeWithAI() {
    if (!this.selectedCountry1 || !this.selectedCountry2) return;
    this.isLoadingAnalysis = true;
    this.analysisResult = null;
    this.aiAnalysisService.getEconomicComparison(this.selectedCountry1, this.selectedCountry2)
      .subscribe({
        next: (result) => {
          this.analysisResult = result;
          this.isLoadingAnalysis = false;
          // Initialize the chat history with a system message and the initial analysis
          this.chatHistory = [
            { role: 'system', content: 'You are a helpful economic analyst. The user has just received the following analysis. Answer their follow-up questions based on this context.' },
            { role: 'assistant', content: result }
          ];
        },
        error: (err) => {
          this.analysisResult = "There was an error processing the analysis.";
          this.isLoadingAnalysis = false;
        }
      });
  }

  // Function to handle sending a follow-up chat message
  sendChatMessage() {
    if (!this.chatInput.trim()) return;
    this.chatHistory.push({ role: 'user', content: this.chatInput });
    this.isChatLoading = true;
    this.chatInput = '';

    this.aiAnalysisService.getFollowUpAnswer(this.chatHistory)
      .subscribe({
        next: (response) => {
          this.chatHistory.push({ role: 'assistant', content: response });
          this.isChatLoading = false;
        },
        error: (err) => {
          this.chatHistory.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
          this.isChatLoading = false;
        }
      });
  }

  // Function to reset the entire page state
  resetComparison() {
    this.selectedCountry1 = null;
    this.selectedCountry2 = null;
    this.analysisResult = null;
    this.chatHistory = [];
    this.searchTerm1.next('');
    this.searchTerm2.next('');
  }

  // Helper functions for search and selection
  private filterCountries(countries: Country[], term: string, other: Country | null): Country[] {
    return countries.filter(c => c.name.toLowerCase().includes(term.toLowerCase()) && c.id !== other?.id);
  }
  onSearch1(e: Event) { this.searchTerm1.next((e.target as HTMLInputElement).value); }
  onSearch2(e: Event) { this.searchTerm2.next((e.target as HTMLInputElement).value); }
  selectCountry1(c: Country) { this.selectedCountry1 = c; this.searchTerm1.next(''); this.analysisResult = null; this.chatHistory = []; }
  selectCountry2(c: Country) { this.selectedCountry2 = c; this.searchTerm2.next(''); this.analysisResult = null; this.chatHistory = []; }
}
