import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { API } from 'src/app/models/api';
import { APIService } from 'src/app/services/api.service';
import { businessModels } from '../business-models.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { isPlatformBrowser } from '@angular/common';

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

@Component({
  selector: 'app-edit-api',
  templateUrl: './edit-api.component.html',
  styleUrls: ['./edit-api.component.css']
})
export class EditAPIComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  restApi: API;
  currentUser: User;
  activeRole: string;
  editAPIForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  logo: any;
  businessModels = businessModels;

  constructor(
    public translateService: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder,
    private imgStorageService: ImgStorageService,
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    private authService: AuthService,
    private imgMaxService: Ng2ImgMaxService,
    @Inject(PLATFORM_ID) private platformId
    ) {
    super(translateService);
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.getIdToken()) {
      this.activeRole = this.currentUser.role.toString();
      this.createForm();
    } else {
      this.router.navigate(['login']);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.params.subscribe(
        (params: Params) =>
          this.apiService.getApi(params.id).then(api =>  {
            if (!api) {
              this.router.navigate(['404']);
            } else {
              this.restApi = api;
              this.editAPIForm.patchValue({
                name: api.name,
                description: api.metadata.description,
                logoURL: api.logoUrl
              });
              this.restApi.businessModels.forEach(businessModel => {
                const val = {};
                val[businessModel] = true;
                this.editAPIForm.patchValue(val);
              });
              this.onLoadLogoURL();
            }
          }, err => {
            this.router.navigate(['404']);
          })
      );
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
    }
  }

  createForm() {
    const formGroup = {
      name: ['', Validators.required],
      logoURL: ['', Validators.required],
      description: ['', Validators.required],
      validated: ['true']
    };
    businessModels.forEach(businessModel => formGroup[businessModel] = ['']);
    this.editAPIForm = this.fb.group(formGroup, { validators: [this.checkBusinessModels] });
  }

  checkBusinessModels(group: FormGroup) {
    return businessModels.filter(businessModel => group.get(businessModel).value === true).length > 0 ? null : { noBusinessModel: true };
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

  onLoadLogoURL() {
    if (this.editAPIForm.value.logoURL != null && this.editAPIForm.value.logoURL !== '') {
      this.logo = null;
      (document.getElementById('imageLogo') as HTMLImageElement).src = this.editAPIForm.value.logoURL;
    }
  }

  onLoadLogoFile() {
    this.imgMaxService.compressImage((document.getElementById('logo') as HTMLInputElement).files[0], 0.1).subscribe(img => {
      if (img != null) {
        const imageUrl = URL.createObjectURL(img);
        this.logo = img;
        setTimeout(() => (document.getElementById('imageLogo') as HTMLImageElement).src = imageUrl, 500);
      }
    }, err => this.showError(this.translateService.instant('api.errors.unprocessable_file')));
  }

  async storeLogo() {
    const blobImg = this.logo;
    await this.imgStorageService.uploadImage(
      blobImg,
      'RestAPI',
      snakeCase(this.editAPIForm.value.name) + (
        blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
      )
    ).then((downloadURL) => {
      this.editAPIForm.patchValue({ logoURL: downloadURL });
    });
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    };
    fileReader.readAsText(pathFile);
  }

  blacklistAPI() {
    this.apiService.blacklistApi(this.restApi, true);
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }

  unblacklistAPI() {
    this.apiService.blacklistApi(this.restApi, false);
    this.modalService.dismissAll();
    this.router.navigate(['api', this.restApi._id]);
  }

  deleteAPI() {
    this.apiService.deleteApi(this.restApi._id);
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }

  openModal(content) {
    this.modalService.open(content, { centered: true });
  }

  goToRestAPI() {
    this.router.navigate(['api', this.restApi._id]);
  }

  goToLinkProvider() {
    this.router.navigate(['api', this.restApi._id, 'provider', 'link']);
  }

  goToAddVersion() {
    this.router.navigate(['api', this.restApi._id, 'version', 'add']);
  }

  editAPI() {
    const values = this.editAPIForm.value;
    this.restApi.name = values.name;
    this.restApi.logoUrl = values.logoURL;
    this.restApi.metadata.description = values.description;
    this.restApi.businessModels =  businessModels.filter(businessModel => values[businessModel]);
    this.apiService.updateApi(this.restApi).then(_ => this.goToRestAPI())
      .catch(_ => this.showError(this.translateService.instant('api.errors.fail_edit_api')));
  }

  onEditAPI() {
    const values = this.editAPIForm.value;
    this.apiService.getApisByName(values.name).then(async result => {
      if (this.restApi.name !== values.name && result.length !== 0) {
        this.showError(this.translateService.instant('api.errors.already_exist_name'));
      } else {
        if (this.logo != null) {
          await this.storeLogo().then(_ => this.editAPI())
          .catch(_ => this.showError(this.translateService.instant('api.errors.load_logo_unexpected')));
        } else {
          this.editAPI();
        }
      }
    });
  }
}
