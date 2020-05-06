import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProviderService } from 'src/app/services/provider.service';
import { Provider } from 'src/app/models/provider';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ImgStorageService } from 'src/app/services/img-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ng2ImgMaxService } from 'ng2-img-max';

const snakeCase = (str) => {
  return str.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word: string) => word.toLowerCase())
    .join('_');
};

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.css']
})
export class EditProviderComponent extends TranslatableComponent implements OnInit, AfterViewInit {

  provider: Provider;
  currentUser: User;
  activeRole: string;
  editProviderForm: FormGroup;
  errorMessage: string;
  errorAlert: HTMLDivElement;
  logo: any;
  links = [
    'link-0'
  ];

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private imgStorageService: ImgStorageService,
    private activatedRoute: ActivatedRoute,
    private providerService: ProviderService,
    private authService: AuthService,
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

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) =>
        this.providerService.getProvider(params.id).then(provider =>  {
          if (!provider) {
            this.router.navigate(['404']);
          } else {
            this.provider = provider;
            this.editProviderForm.patchValue({
              name: provider.name,
              description: provider.description,
              logoURL: provider.logoUrl
            });
            this.provider.externalLinks.forEach((link, i) => {
              const value = {};
              value['link-' + i] = link;
              this.editProviderForm.patchValue(value);
              this.addLink('link-' + i);
            });
            this.onLoadLogoURL();
          }
        }, err => {
          this.router.navigate(['404']);
        })
    );
  }

  ngAfterViewInit() {
    this.errorAlert = document.getElementById('errorAlert') as HTMLDivElement;
  }

  createForm() {
    this.editProviderForm = this.fb.group({
        name: ['', Validators.required],
        logoURL: ['', Validators.required],
        description: ['', Validators.required],
        externalsLinks: [''],
        'link-0': [''],
        validated: ['true']
      });
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
    if (this.editProviderForm.value.logoURL != null && this.editProviderForm.value.logoURL !== '') {
      this.logo = null;
      (document.getElementById('imageLogo') as HTMLImageElement).src = this.editProviderForm.value.logoURL;
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
      'Provider',
      snakeCase(this.editProviderForm.value.name) + (
        blobImg.name.lastIndexOf('.') != null ? blobImg.name.slice(blobImg.name.lastIndexOf('.')) : ''
      )
    ).then((downloadURL) => {
      this.editProviderForm.patchValue({ logoURL: downloadURL });
    });
  }

  uploadDocument(pathFile: Blob, onLoad: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      onLoad(fileReader.result);
    };
    fileReader.readAsText(pathFile);
  }

  addLink(linkIndex: string) {
    if (this.editProviderForm.value[linkIndex]) {
      const nextIndex = linkIndex.slice(0, linkIndex.length - 1) + (Number.parseInt(linkIndex.slice(linkIndex.length - 1), 10) + 1);
      if (!this.editProviderForm.contains(nextIndex)) {
        this.editProviderForm.addControl(nextIndex, new FormControl(''));
        this.links.push(nextIndex);
      }
    }
  }

  blacklistProvider() {
    this.providerService.blacklistProvider(this.provider);
    this.modalService.dismissAll();
    this.router.navigate(['']);
  }

  unblacklistProvider() {
    this.providerService.unblacklistProvider(this.provider);
    this.modalService.dismissAll();
    this.router.navigate(['provider', this.provider._id]);
  }

  openModal(content) {
    this.modalService.open(content, { centered: true });
  }

  goToProvider() {
    this.router.navigate(['provider', this.provider._id]);
  }

  editProvider() {
    const values = this.editProviderForm.value;
    const linksProperties = Object.keys(values).filter(property => property.startsWith('link-'));
    // tslint:disable-next-line: no-shadowed-variable tslint:disable-next-line: triple-equals
    const links = linksProperties.map(linkProperty => values[linkProperty]).filter(link => link != '');
    this.provider.name = values.name;
    this.provider.logoUrl = values.logoURL;
    this.provider.description = values.description;
    this.provider.externalLinks = links;
    this.providerService.updateProvider(this.provider).then(_ => this.goToProvider())
      .catch(_ => this.showError(this.translateService.instant('provider.errors.fail_edit_provider')));
  }

  onEditProvider() {
    const values = this.editProviderForm.value;
    this.providerService.getProvidersByName(values.name).then(async result => {
      if (this.provider.name !== values.name && result && result.filter(p => p.name === values.name).length !== 0) {
        this.showError(this.translateService.instant('provider.errors.already_exist_name'));
      } else {
        if (this.logo != null) {
          await this.storeLogo().then(_ => this.editProvider())
          .catch(_ => this.showError(this.translateService.instant('api.errors.load_logo_unexpected')));
        } else {
          this.editProvider();
        }
      }
    });
  }

}
