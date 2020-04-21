import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProviderComponent } from './link-provider.component';

describe('LinkProviderComponent', () => {
  let component: LinkProviderComponent;
  let fixture: ComponentFixture<LinkProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
