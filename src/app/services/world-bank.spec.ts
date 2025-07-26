import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import this for testing HTTP requests

import { WorldBankService } from './world-bank'; 

describe('WorldBankService', () => { 
  let service: WorldBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(WorldBankService); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});