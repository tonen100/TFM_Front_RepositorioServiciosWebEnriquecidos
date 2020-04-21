import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule} from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [FormsModule,
        TranslateModule,
        AngularFireModule.initializeApp({
          apiKey: 'AIzaSyDLqZG0zNK1rZB7S_D_QVRI-KKDPmxNk8g',
          authDomain: 'tfm-api-repositorio.firebaseapp.com',
          databaseURL: 'https://tfm-api-repositorio.firebaseio.com',
          projectId: 'tfm-api-repositorio',
          storageBucket: 'tfm-api-repositorio.appspot.com',
          messagingSenderId: '86439804625',
          appId: '1:86439804625:web:167d40897d54d0baffcff0'
        })
      ],
      providers: [AngularFireAuth]
    })
    .compileComponents();
  }));

  // imports: [
  //   BrowserModule,
  //   FormsModule,
  //   AngularFontAwesomeModule,
  //   AngularFireModule.initializeApp(firebaseConfig),
  //   CollapseModule.forRoot(),
  //   BsDropdownModule.forRoot(),
  //   HttpClientModule,
  //   TranslateModule.forRoot({
  //     loader: {
  //       provide: TranslateLoader,
  //       useFactory: HttpLoaderFactory,
  //       deps: [HttpClient]
  //     }
  //   }),
  //   AppRoutingModule
  // ],


  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
