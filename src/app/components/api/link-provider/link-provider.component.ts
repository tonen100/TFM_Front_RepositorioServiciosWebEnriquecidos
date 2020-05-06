import { Component, AfterViewInit, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { APIService } from 'src/app/services/api.service';
import { ProviderService } from 'src/app/services/provider.service';
import { Provider } from 'src/app/models/provider';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { Ng2ImgMaxService } from 'ng2-img-max';

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

@Component({
  selector: 'app-link-provider',
  templateUrl: './link-provider.component.html',
  styleUrls: ['./link-provider.component.css']
})
export class LinkProviderComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  currentUser: User;
  activeRole: string;
  linkProviderForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  searchControl = new FormControl();
  listProviders: Provider[] = [];
  apiId: string;
  logo: any;
  links = [
    'link-0'
  ];

  constructor(
    public translateService: TranslateService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imgStorageService: ImgStorageService,
    private apiService: APIService,
    private providerService: ProviderService,
    private imgMaxService: Ng2ImgMaxService
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

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.apiId = params.id;
    });
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
  }

  createForm() {
    this.linkProviderForm = this.fb.group({
        name: [''],
        logoURL: [''],
        description: [''],
        providerId: [''],
        existingProviderName: [''],
        'link-0': [''],
        validated: ['true']
      }, { validators: [this.alternateValidation] });
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

  alternateValidation(group: FormGroup) {
    if (group.get('providerId') && group.get('providerId').value) {
      return null;
    } else if (group.get('name') && group.get('logoURL')  && group.get('description') &&
      group.get('name').value && group.get('logoURL').value  && group.get('description').value) {
      return null;
    } else {
      return { missingProvider: true } ;
    }
  }

  onLoadLogoURL() {
    if (this.linkProviderForm.value.logoURL != null && this.linkProviderForm.value.logoURL !== '') {
      this.logo = null;
      (document.getElementById('imageLogo') as HTMLImageElement).src = this.linkProviderForm.value.logoURL;
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

  onSearching(event: any) {
    this.linkProviderForm.patchValue({ providerId: '' });
    const value = this.linkProviderForm.value.existingProviderName;
    if (value && value.length >= 2) {
      this.providerService.getProvidersByName(value).then(providers => {
        this.listProviders = providers;
      });
    }
  }

  selectProvider(provider: Provider) {
    this.linkProviderForm.patchValue({ providerId: provider._id });
  }

  async storeLogo() {
    const blobImg = this.logo;
    await this.imgStorageService.uploadImage(
      blobImg,
      'Provider',
      snakeCase(this.linkProviderForm.value.name) + (
        blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
      )
    ).then((downloadURL) => {
      this.linkProviderForm.patchValue({ logoURL: downloadURL });
    });
  }

  linkApiToProvider(apiId: string, providerId: string) {
    this.apiService.linkApiToProvider(apiId, providerId).then(_ => this.router.navigate(['api', this.apiId]))
      .catch(_ => this.showError(this.translateService.instant('provider.errors.fail_link_provider')));
  }

  createProvider() {
    const values = this.linkProviderForm.value;
    const linksProperties = Object.keys(values).filter(property => property.startsWith('link-'));
    // tslint:disable-next-line: no-shadowed-variable tslint:disable-next-line: triple-equals
    const links = linksProperties.map(linkProperty => values[linkProperty]).filter(link => link != '');
    const newProvider = new Provider(values.name, values.logoURL, values.description, links);
    this.providerService.postProvider(newProvider).then(provider => this.linkApiToProvider(this.apiId, provider._id))
      .catch(_ => this.showError(this.translateService.instant('provider.errors.fail_create_provider')));
  }

  onLinkApiToProvider() {
    const values = this.linkProviderForm.value;
    if (values.providerId) {
      this.linkApiToProvider(this.apiId, values.providerId);
    } else {
      this.providerService.getProvidersByName(values.name).then(async result => {
        if (result && result.filter(p => p.name === values.name).length !== 0) {
          this.showError(this.translateService.instant('provider.errors.already_exist_name'));
        } else {
          if (this.logo != null) {
            await this.storeLogo().then(_ => this.createProvider())
            .catch(_ => this.showError(this.translateService.instant('api.errors.load_logo_unexpected')));
          } else {
            this.createProvider();
          }
        }
      });
    }
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    };
    fileReader.readAsText(pathFile);
  }

  addLink(linkIndex: string) {
    if (this.linkProviderForm.value[linkIndex]) {
      const nextIndex = linkIndex.slice(0, linkIndex.length - 1) + (Number.parseInt(linkIndex.slice(linkIndex.length - 1), 10) + 1);
      if (!this.linkProviderForm.contains(nextIndex)) {
        this.linkProviderForm.addControl(nextIndex, new FormControl(''));
        this.links.push(nextIndex);
      }
    }
  }

}
