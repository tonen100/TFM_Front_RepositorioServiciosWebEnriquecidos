import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { User } from 'src/app/models/user';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { APIService } from 'src/app/services/api.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { VersionService } from 'src/app/services/version.service';
import { API } from 'src/app/models/api';
import { Version } from 'src/app/models/version';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-version',
  templateUrl: './add-version.component.html',
  styleUrls: ['./add-version.component.css']
})
export class AddVersionComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  currentUser: User;
  activeRole: string;
  createVersionForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  restApi: API;
  previewVersion: {
    originalDocumentation: string;
    oasDocumentation: string;
    metadata: string;
  };

  constructor(
    public translateService: TranslateService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imgStorageService: ImgStorageService,
    private apiService: APIService,
    private versionService: VersionService,
    @Inject(PLATFORM_ID) private platformId
    ) {
      super(translateService);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      if (this.currentUser && this.authService.getIdToken()) {
        this.activeRole = this.currentUser.role.toString();
        this.activatedRoute.params.subscribe(
          (params: Params) => this.apiService.getApi(params.id).then(api => {
            this.restApi = api;
            this.createForm();
          }).catch(_ => this.router.navigate(['404']))
        );
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
    }
  }

  createForm() {
    const formGroup = {
      originalDocumentation: [''],
      versionNb: ['', Validators.required],
      documentation: ['', Validators.required],
      rootUrlApi: [''],
      urlDoc: [''],
      versionSummary: ['', Validators.required],
      validated: ['true']
    };
    this.createVersionForm = this.fb.group(formGroup, { validators: [this.checkDocumentation] });
  }

  showError(message: string) {
    this.hideError();
    this.errorMessage = message;
    this.errorAlert.style.display = 'block';
    this.errorAlert.classList.add('show');
  }

  hideError() {
    this.errorMessage = null;
    this.errorAlert.style.display = 'none';
    this.errorAlert.classList.remove('show');
  }

  checkDocumentation(group: FormGroup) {
    return group.get('originalDocumentation') != null ? null : { missingDoc: true };
  }

  switchDocumentPreview(documentName: string) {
    if (this.previewVersion != null) {
      document.getElementById('documents').getElementsByTagName('pre')[0].textContent = this.previewVersion[documentName];
    }
    document.getElementById('originalDocumentation').classList.remove('active');
    document.getElementById('oasDocumentation').classList.remove('active');
    document.getElementById('metadata').classList.remove('active');
    document.getElementById(documentName).classList.add('active');
  }

  onLoadDocumentation() {
    const fileBlob = (document.getElementById('documentation') as HTMLInputElement).files[0];
    if (['application/json', 'application/x-yaml', 'text/markdown'].find(fileType => fileType === fileBlob.type)) {
      this.uploadDocument(fileBlob, (text) => {
        try {
          this.versionService.getMetadata(text).then(previewVersion => {
            this.createVersionForm.patchValue({
              originalDocumentation: previewVersion.originalDocumentation
            });
            this.previewVersion = {
              originalDocumentation: previewVersion.originalDocumentation,
              oasDocumentation: previewVersion.oasDocumentation,
              metadata: JSON.stringify(previewVersion.metadata, null, '\t'),
            };
            this.switchDocumentPreview('originalDocumentation');
            document.getElementById('documents').getElementsByTagName('nav')[0].style.display = 'flex';
          }).catch(err => {
            switch (err.status) {
              case 422:
                this.showError(this.translateService.instant('api.version.errors.fail_generate_oas_doc'));
                break;
              case 424:
                this.showError(this.translateService.instant('api.version.errors.fail_generate_metadata'));
                break;
              default:
                this.showError(this.translateService.instant('api.version.errors.generate_unexpected'));
            }
          });
        } catch (error) {
          this.showError(this.translateService.instant('api.version.errors.load_doc_unexpected'));
        }
      });
    } else {
      this.showError(this.translateService.instant('api.version.errors.wrong_file_type'));
    }
  }

  goToAPI() {
    this.router.navigate(['api', this.restApi._id]);
  }

  onCreateVersion() {
    const values = this.createVersionForm.value;
    this.versionService.getVersionsByNumber(this.restApi, values.versionNb).then(async result => {
      if (result.length !== 0) {
        this.showError(this.translateService.instant('api.version.errors.already_exist_number'));
      } else {
        // tslint:disable-next-line: max-line-length
        const newVersion = new Version(values.versionNb, values.originalDocumentation, values.versionSummary, values.urlDoc, values.rootUrlApi);
        this.versionService.postVersion(this.restApi, newVersion).then(version => {
          this.router.navigate(['api', this.restApi._id]);
        }).catch(err => {
          this.showError(this.translateService.instant('api.version.errors.fail_create_version'));
        });
      }
    }).catch(err => this.showError(this.translateService.instant('api.errors.server_inaccessible')));
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    };
    fileReader.readAsText(pathFile);
  }

}
