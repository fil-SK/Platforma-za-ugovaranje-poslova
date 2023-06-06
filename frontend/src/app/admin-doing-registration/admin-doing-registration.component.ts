import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-doing-registration',
  templateUrl: './admin-doing-registration.component.html',
  styleUrls: ['./admin-doing-registration.component.css']
})
export class AdminDoingRegistrationComponent implements OnInit {

  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }





  /*
    Znam da nije dobro sto sam ovako uradio, ali bi bilo preveliko petljanje ako bih orignalnu register komponentu morao da modifikujem
  
    Buduci da je ovo komponenta kojoj jedino admin pristupa, time sto se ona nalazi na njegovog admin panelu, to znaci da je apsolutno sigurno bezbedno da se
    zahtev za registracijom odmah postavi na accepted
  */


  // Fields to get information from the form

  username : string;
  password : string;
  confirmPassword : string;
  phoneNumber : string;
  email : string;
  userType : string;

  // Information for the client
  firstname : string;
  lastname : string;

  // Information for the agency
  agencyName : string;
  agencyId : string;
  description : string;
  agencyAddress : string;
  streetNumber : string;
  city : string;
  state : string;


  // Fields for additional info on the page
  message : string;


  image;
  imageWidth : number;
  imageHeight : number;
  imageExtension : string;
  wrongImageDimensionsMessage : string;
  wrongImageExtensionMessage : string;

  selectedImage(event){
    if(event.target.files.length > 0){
      this.image = event.target.files[0];     // Get the image

      // Get the image format
      const imageName = this.image.name;
      const imageExtension = imageName.split('.').pop()?.toLowerCase();   // '?' operator ensures that the code handles cases where pop() returns 'undefined' and avoids potential runtime errors 
      console.log('Ekstenzija je ' + imageExtension);
      this.imageExtension = imageExtension;

      // Clear error text if format is acceptable - optional
      if(imageExtension == 'jpg' || imageExtension == 'png'){
        this.wrongImageExtensionMessage = "";
      }


      // Get the image resolution
      const reader = new FileReader();
      reader.onload = (e : any) => {

        const uploadedImage = new Image();
        
        uploadedImage.onload = () => {
          const width = uploadedImage.naturalWidth;
          const height = uploadedImage.naturalHeight;

          console.log('Image width:', width);
          console.log('Image height:', height);

          // Save width and height in component fields
          this.imageWidth = width;
          this.imageHeight = height;


          // Clear error message if image resolution is in acceptable range - optional
          if(width >= 100 && width <= 300 && height >= 100 && height <=300){
            this.wrongImageDimensionsMessage = "";
          }

        };
        uploadedImage.src = e.target.result;   
      };

      reader.readAsDataURL(this.image);    // Converts to data URL

    }
  }



  register(form :NgForm){

    if(form.invalid){

      // If form is invalid by validators, mark every form as touched, so that validator message could be displayed
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      return;
    }

    // Check if password and repeatPassword form elements match
    if(this.password != this.confirmPassword){
      return;
    }


    // Validating image here, and not in selectedImage method to stop form from submitting if requirements are not met


    // Validate image extension
    if(!(this.imageExtension == 'jpg' || this.imageExtension == 'png') && this.image != null){
      this.wrongImageExtensionMessage = "Slika nije u predvidjenom formatu! Slika moze biti samo u formatu 'jpg' ili 'png'!";
      return;
    }
    else{
      this.wrongImageExtensionMessage = "";
    }

    // Validate image dimensions
    if(this.imageWidth < 100 || this.imageWidth > 300 || this.imageHeight < 100 || this.imageHeight > 300){
      this.wrongImageDimensionsMessage = "Rezolucija slike nije u dozvoljenom opsegu! Slika moze biti minimalne rezolucije 100x100 i maksimalne rezolucije 300x300 piksela!";
      return;
    }
    else{
      this.wrongImageDimensionsMessage = "";
    }


    // Validation passed, continue

    if(this.userType == 'client'){

      // First, verify if the client info from the form (username and email) are unique
      this.userService.verifyClient(this.username, this.email).subscribe( resp => {
        
        if(resp['message'] == 'usernameNotUnique'){
          this.message = 'Korisnicko ime vec postoji u sistemu!';
          return;
        }

        else if(resp['message'] == 'emailNotUnique'){
          this.message = 'Email adresa vec postoji u sistemu!';
          return;
        }

        else if(resp['message'] == 'userNotInDatabase'){

          // User with this username and email doesn't exist in database, so we can add him


          // Prepare data for the request
          const formData = new FormData();
          formData.set('firstname', this.firstname);
          formData.set('lastname', this.lastname);
          formData.set('username', this.username);
          formData.set('password', this.password);
          formData.set('phone', this.phoneNumber);
          formData.set('email', this.email);
          formData.append('image', this.image);


          // Check if values are correctly stored in FormData
          for (const value of formData.values()) {
            console.log(value);
          }

          this.userService.registerClient(formData).subscribe( res => {

            if(res['message'] == 'registeredClient'){


              // Ovo je dodatak - odmah postavljamo da je requestStatus accepted
              this.userService.setRegStatusToAccepted(this.username, this.userType).subscribe( response => {
                if(response['message'] == 'adminRegConfirmed'){
                  this.message = 'Klijent uspesno registrovan!';
                }

              });
              
            }
            else{
              this.message = 'Greska pri registraciji!';
            }
          });

        }

      });

    }
    
    else if(this.userType == 'agency'){


      // Verify if agency info from the form (username, email, agencyId) are unique
      this.userService.verifyAgency(this.username, this.email, this.agencyId).subscribe( resp => {

        if(resp['message'] == 'usernameNotUnique'){
          this.message = 'Korisnicko ime vec postoji u sistemu!';
          return;
        }

        else if(resp['message'] == 'emailNotUnique'){
          this.message = 'Email adresa vec postoji u sistemu!';
          return;
        }

        else if(resp['message'] == 'agencyIdNotUnique'){
          this.message = 'Maticni broj vec postoji u sistemu!';
          return;
        }

        else if(resp['message'] == 'userNotInDatabase'){

          // Agency with this username, email and agencyId doesn't exist in database, so we can add it


          // Prepare data for the request
          const formData = new FormData();
          formData.set('agencyName', this.agencyName);
          formData.set('streetAddress', this.agencyAddress);
          formData.set('streetNumber', this.streetNumber);
          formData.set('city', this.city);
          formData.set('state', this.state);
          formData.set('agencyId', this.agencyId);
          formData.set('description', this.description);
          formData.set('username', this.username);
          formData.set('password', this.password);
          formData.set('phone', this.phoneNumber);
          formData.set('email', this.email);
    
          formData.append('image', this.image);


          // Check if values are correctly stored in FormData
          for (const value of formData.values()) {
            console.log(value);
          }


          this.userService.registerAgency(formData).subscribe( res => {
            if(res['message'] == 'registeredAgency'){

              // Odmah postavi i da je status accepted
              this.userService.setRegStatusToAccepted(this.username, this.userType).subscribe( response => {
                if(response['message'] == 'adminRegConfirmed'){
                  this.message = 'Agencija uspesno registrovana!';
                }

              });
              
            }
            else{
              this.message = 'Greska pri registraciji!';
            }
          });
        }

      });


    }
  }

}
