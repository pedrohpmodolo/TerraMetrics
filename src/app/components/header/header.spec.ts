import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header'; // <-- FIX: Changed to HeaderComponent

describe('HeaderComponent', () => { // <-- FIX: Changed to HeaderComponent
  let component: HeaderComponent; // <-- FIX: Changed to HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>; // <-- FIX: Changed to HeaderComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent] // <-- FIX: Changed to HeaderComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent); // <-- FIX: Changed to HeaderComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});