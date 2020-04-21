import { Component, AfterViewInit } from '@angular/core';
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

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

const businessModels = [
  'Free',
  'FreeWithLimitations',
  'FreeTrialVersion',
  'FlatRateAllInclusive',
  'FlatRatesWithLimitations',
  'Billing'
];

@Component({
  selector: 'app-add-api',
  templateUrl: './add-api.component.html',
  styleUrls: ['./add-api.component.css']
})
export class AddAPIComponent implements AfterViewInit {

  currentUser: User;
  activeRole: string;
  createAPIForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  originalDocumentation: string;
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

  onLoadDocumentation() {
    const fileBlob = (document.getElementById('documentation') as HTMLInputElement).files[0];
    if(['application/json', 'application/x-yaml', 'text/markdown'].find(fileType => fileType === fileBlob.type)) {
      this.uploadDocument(fileBlob, (text) => {
        try {
          this.createAPIForm.value.originalDocumentation = text;
          document.getElementById('OASDocument').childNodes[0].textContent = text;
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
        console.log(this.createAPIForm.value)
      });
    } catch(error) {
      // TODO
    }
  }

  onCreateAPI() {
    if(this.logo != null) {
      this.storeLogo();
    }
    const values = this.createAPIForm.value;
    const newAPI = new API(values.name, values.logoURL, values.businessModels);
    this.apiService.postApi(newAPI).then(api => {
      console.log(JSON.stringify(api));
      const newVersion = new Version(values.versionNb, values.originalDocumentation, values.versionSummary);
      this.versionService.postVersion(api, newVersion).then(version => {
        this.router.navigate(['api', api._id, 'provider', 'link']);
      }).catch(err => {
        this.apiService.deleteApi(api._id);
        this.showError('Failed to create the version of the API check the validity of the informations (especially the documentation)');
      }).catch(err => this.showError('Failed to create the REST API check the validity of the informations'));
    });
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    }
    fileReader.readAsText(pathFile);
  }

}
