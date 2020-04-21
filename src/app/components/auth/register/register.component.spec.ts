import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule,
        AngularFireModule.initializeApp({
          apiKey: 'AIzaSyDLqZG0zNK1rZB7S_D_QVRI-KKDPmxNk8g',
          authDomain: 'tfm-api-repositorio.firebaseapp.com',
          databaseURL: 'https://tfm-api-repositorio.firebaseio.com',
          projectId: 'tfm-api-repositorio',
          storageBucket: 'tfm-api-repositorio.appspot.com',
          messagingSenderId: '86439804625',
          appId: '1:86439804625:web:167d40897d54d0baffcff0'
        })],
      providers: [AngularFireAuth]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
