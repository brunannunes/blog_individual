import { TestBed } from '@angular/core/testing';

import { CardsServicesService } from './cards-services.service';

describe('CardsServicesService', () => {
  let service: CardsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
