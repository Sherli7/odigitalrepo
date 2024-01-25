import { Component } from '@angular/core';
import { NodeService } from '../../service/node.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  userProfile = {
    id: '',
    firstName: '',
    lastName: '',
    displayName: '',
    description: '',
    avatarId: '',
    email: '',
    skypeId: '',
    googleId: '',
    instantMessageId: '',
    jobTitle: '',
    location: '',
    company: {
      organization: '',
      address1: '',
      address2: '',
      address3: '',
      postcode: '',
      telephone: '',
      fax: '',
      email: ''
    },
    mobile: '',
    telephone: '',
    statusUpdatedAt: '',
    userStatus: '',
    enabled: false,
    emailNotificationsEnabled: false,
    aspectNames: [],
    properties: {},
    capabilities: {}
  };
  avatarId: any;

  constructor(private account: NodeService) { }

  ngOnInit(): void {
    this.getAvatar();
    const userId = 'test'; // Adjust as needed for your application context
    this.account.getAccountProperties(userId).subscribe(
      (data: any) => {
        this.userProfile = data.entry;
        // Now you need to call getAvatar here to ensure userProfile.id is available
        this.getAvatar();
      },
      error => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  saveChanges() {
    console.log('Form submitted', this.userProfile);
  }

  getAvatar() {
    //const userId = this.userProfile.id || 'default'; // Use a default or fetched userId
    this.account.getAccountAvatar().subscribe(
      (imgBlob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        reader.onloadend = () => {
          this.avatarId = reader.result as string; // Assign the Base64 string to avatarId
        };
      },
      error => {
        console.error('Error fetching avatar:', error);
      }
    );
  }
  
}
