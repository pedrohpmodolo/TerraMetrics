import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Country } from './world-bank'; // Import the Country interface

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Controls panel visibility
  private isPanelOpen = new BehaviorSubject<boolean>(false);
  public isPanelOpen$ = this.isPanelOpen.asObservable();

  // --- NEW: Keeps track of the currently selected country ---
  private selectedCountry = new BehaviorSubject<Country | null>(null);
  public selectedCountry$ = this.selectedCountry.asObservable();

  constructor() { }

  openPanel() {
    this.isPanelOpen.next(true);
  }

  closePanel() {
    this.isPanelOpen.next(false);
    // When closing the panel, also clear the selected country
    this.selectedCountry.next(null);
  }

  // --- NEW: Method to select a country ---
  selectCountry(country: Country) {
    this.selectedCountry.next(country);
    this.openPanel(); // Also ensure the panel is open when a country is selected
  }
}
