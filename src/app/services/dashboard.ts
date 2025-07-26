import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from '@angular/fire/firestore';
import { AuthService } from './auth';
import { Country, Indicator } from './world-bank';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// This new interface can represent either a saved country or a saved chart
export interface SavedItem {
  id?: string; // Firestore document ID
  userId: string;
  type: 'country' | 'chart';
  country: Country;
  indicator?: Indicator; // Optional: only for items of type 'chart'
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  // Save a new country to the user's dashboard
  addCountry(country: Country) {
    const user = this.authService.currentUser;
    if (!user) return Promise.reject('User not logged in');
    
    const dashboardCollection = collection(this.firestore, 'dashboards');
    const item: SavedItem = {
      userId: user.uid,
      type: 'country',
      country
    };
    return addDoc(dashboardCollection, item);
  }

  // Save a new individual chart to the user's dashboard
  addChart(country: Country, indicator: Indicator) {
    const user = this.authService.currentUser;
    if (!user) return Promise.reject('User not logged in');
    
    const dashboardCollection = collection(this.firestore, 'dashboards');
    const item: SavedItem = {
      userId: user.uid,
      type: 'chart',
      country,
      indicator
    };
    return addDoc(dashboardCollection, item);
  }

  // Get a real-time stream of all the user's saved items
  getUserDashboardItems(): Observable<SavedItem[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          const q = query(collection(this.firestore, 'dashboards'), where('userId', '==', user.uid));
          return new Observable<SavedItem[]>(subscriber => {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const items: SavedItem[] = [];
              querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as SavedItem);
              });
              subscriber.next(items);
            });
            return unsubscribe;
          });
        } else {
          return of([]);
        }
      })
    );
  }

  // Delete an item (either a country or a chart) from the user's dashboard
  deleteDashboardItem(itemId: string) {
    const itemDocRef = doc(this.firestore, `dashboards/${itemId}`);
    return deleteDoc(itemDocRef);
  }
}
