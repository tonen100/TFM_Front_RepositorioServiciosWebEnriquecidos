import { Component, AfterViewInit } from '@angular/core';
import { User } from '../../../models/user';
import { Version } from '../../../models/version';
import { API } from '../../../models/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { APIService } from 'src/app/services/api.service';
import { ProviderService } from 'src/app/services/provider.service';
import { Provider } from 'src/app/models/provider';

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
export class LinkProviderComponent implements AfterViewInit {

  currentUser: User;
  activeRole: string;
  linkProviderForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  apiId: string;
  logo: any;
  links = [
    'link-0'
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private imgStorageService: ImgStorageService,
    private apiService: APIService,
    private providerService: ProviderService
    ) {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.authService.getIdToken()) {
      this.activeRole = this.currentUser.role.toString();
      this.createForm();
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.apiId = params.id;
      });
    } else {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
  }

  createForm() {
    this.linkProviderForm = this.fb.group({
        name: [''],
        logoURL: [''],
        description: [''],
        externalsLinks: [''],
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
    if(group.get('providerId')) {
      return null;
    } else if(group.get('logoURL') && group.get('logoURL') && group.get('description') && group.get('externalLinks')) {
      return null;
    } else {
      return { missingProvider: true } ;
    }
  }

  onLoadLogoURL() {
    if(this.linkProviderForm.value.logoURL != null && this.linkProviderForm.value.logoURL !== '') {
      this.logo = null;
      (document.getElementById('imageLogo') as HTMLImageElement).src = this.linkProviderForm.value.logoURL;
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

  storeLogo() {
    try {
      const blobImg = (document.getElementById('logo') as HTMLInputElement).files[0];
      this.imgStorageService.uploadImage(
        blobImg,
        'Provider',
        snakeCase(this.linkProviderForm.value.name) + (
          blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
        )
      ).then((downloadURL) => {
        this.linkProviderForm.value.logoURL = downloadURL;
        console.log(this.linkProviderForm.value)
      });
    } catch(error) {
      // TODO
    }
  }

  linkApiToProvider(apiId: string, providerId: string) {
    this.apiService.linkApiToProvider(apiId, providerId).then(_ => this.router.navigate(['api', this.apiId]))
      .catch(_ => this.showError('Failed to link the provider to the REST API'));
  }

  onLinkApiToProvider() {
    if(this.logo != null) {
      this.storeLogo();
    }
    const values = this.linkProviderForm.value;
    if(values.providerId) {
      this.linkApiToProvider(this.apiId, values.providerId);
    } else {
      const newProvider = new Provider(values.name, values.logoURL, values.description, values.externalLinks);
      this.providerService.postProvider(newProvider).then(provider => this.linkApiToProvider(this.apiId, provider._id))
        .catch(_ => this.showError('Failed to create the provider, please check the validity of the informations'));
    }
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    }
    fileReader.readAsText(pathFile);
  }

  addLink(linkIndex: string) {
    if(this.linkProviderForm.value[linkIndex]) {
      const nextIndex = linkIndex.slice(0, linkIndex.length - 1) + (Number.parseInt(linkIndex.slice(linkIndex.length - 1), 10) + 1);
      if(!this.linkProviderForm.contains(nextIndex)) {
        this.linkProviderForm.addControl(nextIndex, new FormControl(''));
        this.links.push(nextIndex);
      }
    }
  }

}
