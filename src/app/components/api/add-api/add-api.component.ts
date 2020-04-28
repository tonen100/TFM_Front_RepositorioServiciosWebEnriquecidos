import { Component, AfterViewInit, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { Version } from '../../../models/version';
import { API } from '../../../models/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { APIService } from 'src/app/services/api.service';
import { VersionService } from 'src/app/services/version.service';
import { businessModels } from '../business-models.enum';

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

@Component({
  selector: 'app-add-api',
  templateUrl: './add-api.component.html',
  styleUrls: ['./add-api.component.css']
})
export class AddAPIComponent implements OnInit, AfterViewInit {

  currentUser: User;
  activeRole: string;
  createAPIForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  previewVersion: {
    originalDocumentation: string;
    oasDocumentation: string;
    metadata: string;
  };
  logo: any;
  businessModels = businessModels;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private imgStorageService: ImgStorageService,
    private apiService: APIService,
    private versionService: VersionService
    ) {

  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.getIdToken()) {
      this.activeRole = this.currentUser.role.toString();
      this.createForm();
    } else {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
  }

  createForm() {
    const formGroup = {
      name: ['', Validators.required],
      logoURL: [''],
      originalDocumentation: [''],
      versionNb: ['', Validators.required],
      documentation: ['', Validators.required],
      versionSummary: ['', Validators.required],
      validated: ['true']
    };
    businessModels.forEach(businessModel => formGroup[businessModel] = ['']);
    this.createAPIForm = this.fb.group(formGroup, { validators: [this.checkDocumentation, this.checkBusinessModels] });
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

  checkBusinessModels(group: FormGroup) {
    return businessModels.filter(businessModel => group.get(businessModel).value === true).length > 0 ? null : { noBusinessModel: true };
  }

  onLoadLogoURL() {
    if(this.createAPIForm.value.logoURL != null && this.createAPIForm.value.logoURL != '') {
      this.logo = null;
      (document.getElementById('imageLogo') as HTMLImageElement).src = this.createAPIForm.value.logoURL;
    }
  }

  onLoadLogoFile() {
    const imageUrl = URL.createObjectURL((document.getElementById('logo') as HTMLInputElement).files[0]);
    this.uploadDocument((document.getElementById('logo') as HTMLInputElement).files[0], (img) => {
      try {
        if(img != null) {
          this.logo = img;
          (document.getElementById('imageLogo') as HTMLImageElement).src = imageUrl;
        }
      } catch(error) {
        this.showError('Failed to load the image, the file might be a binary, corrupted or just unaccessible');
      }
    });
  }

  switchDocumentPreview(documentName: string) {
    if(this.previewVersion != null) {
      document.getElementById('documents').getElementsByTagName('pre')[0].textContent = this.previewVersion[documentName];
    }
    document.getElementById('originalDocumentation').classList.remove('active');
    document.getElementById('oasDocumentation').classList.remove('active');
    document.getElementById('metadata').classList.remove('active');
    document.getElementById(documentName).classList.add('active');
  }

  onLoadDocumentation() {
    const fileBlob = (document.getElementById('documentation') as HTMLInputElement).files[0];
    if(['application/json', 'application/x-yaml', 'text/markdown'].find(fileType => fileType === fileBlob.type)) {
      this.uploadDocument(fileBlob, (text) => {
        try {
          this.versionService.getMetadata(text).then(previewVersion => {
            this.createAPIForm.patchValue({
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
            switch(err.status) {
              case 422:
                this.showError('Failed to generate the OAS documentation, your documentation might be invalid');
                break;
              case 424:
                this.showError('Failed to extract the metadata, your documentation might be invalid');
                break;
              default:
                this.showError('Failed to extract the metadata (Unexpected error)');
            }
          });
        } catch(error) {
          this.showError('Failed to load the documentation (Unexpected error)');
        }
      });
    } else {
      this.showError('Failed to load the documentation, couldn\'t recognize the file type');
    }
  }

  storeLogo() {
    try {
      const blobImg = (document.getElementById('logo') as HTMLInputElement).files[0];
      this.imgStorageService.uploadImage(
        blobImg,
        'RestAPI',
        snakeCase(this.createAPIForm.value.name) + (
          blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
        )
      ).then((downloadURL) => {
        this.createAPIForm.value.logoURL = downloadURL;
      });
    } catch(error) {
      this.showError('Impossible to request the server right now, wait a bit and retry');
    }
  }

  onCreateAPI() {
    const values = this.createAPIForm.value;
    this.apiService.getApisByName(values.name).then(result => {
      if(result.length !== 0) {
        this.showError('An API with this name already exists');
      } else {
        if(this.logo != null) {
          this.storeLogo();
        }
        const newAPI = new API(values.name, values.logoURL, businessModels.filter(businessModel => values[businessModel]));
        this.apiService.postApi(newAPI).then(api => {
          const newVersion = new Version(values.versionNb, values.originalDocumentation, values.versionSummary);
          this.versionService.postVersion(api, newVersion).then(version => {
            this.router.navigate(['api', api._id, 'provider', 'link']);
          }).catch(err => {
            this.apiService.deleteApi(api._id);
            this.showError('Failed to create the version of the API, please check the validity of the informations (documentation...)');
          });
        }).catch(err => {
          switch(err.status) {
            case 401:
            case 403:
              this.authService.logout();
              this.router.navigate(['login'])
              break;
            case 404:
              this.showError('Impossible to request the server right now, wait a bit and retry');
              break;
            case 422:
              this.showError('Failed to create the REST API, please check the validity of the informations (your connexion)');
              break;
            default:
              this.showError('Failed to extract the version of the API (Unexpected error)');
          }
        });
      }
    }).catch(err => this.showError('Impossible to request the server right now, wait a bit and retry'));
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    }
    fileReader.readAsText(pathFile);
  }

}
