import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVersionComponent } from './details-version.component';

describe('DetailsVersionComponent', () => {
  let component: DetailsVersionComponent;
  let fixture: ComponentFixture<DetailsVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
