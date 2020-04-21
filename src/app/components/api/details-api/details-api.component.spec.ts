import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAPIComponent } from './details-api.component';

describe('DetailsAPIComponent', () => {
  let component: DetailsAPIComponent;
  let fixture: ComponentFixture<DetailsAPIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAPIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
