import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestApiItemComponent } from './rest-api-item.component';

describe('RestApiItemComponent', () => {
  let component: RestApiItemComponent;
  let fixture: ComponentFixture<RestApiItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestApiItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestApiItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
