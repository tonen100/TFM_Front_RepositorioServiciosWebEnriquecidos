import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestApiColumnItemComponent } from './rest-api-column-item.component';

describe('RestApiColumnItemComponent', () => {
  let component: RestApiColumnItemComponent;
  let fixture: ComponentFixture<RestApiColumnItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestApiColumnItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestApiColumnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
