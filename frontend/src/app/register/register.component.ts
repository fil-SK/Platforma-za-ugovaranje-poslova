import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService : UserService) { }

  ngOnInit(): void {
  }


  // Current



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

      const formData = new FormData();
      formData.set('firstname', this.firstname);
      formData.set('lastname', this.lastname);
      formData.set('username', this.username);
      formData.set('password', this.password);
      formData.set('phone', this.phoneNumber);
      formData.set('email', this.email);
      
      formData.append('image', this.image);
  
      console.log(formData);
      
      // Log, to check if values are correctly stored
      for (const value of formData.values()) {
        console.log(value);
      }
  
      // const urlEncoded = new URLSearchParams(formData as any).toString();

      this.userService.registerClient(formData).subscribe(
        (resp) => {

          if(resp['message'] == 'usernameNotUnique'){
            this.message = 'Korisnicko ime vec postoji u sistemu!';
          }

          else if(resp['message'] == 'emailNotUnique'){
            this.message = 'Email adresa vec postoji u sistemu!';
          }

          else if(resp['message'] == 'registeredClient'){
            this.message = 'Klijent uspesno registrovan!';
          }

          else{
            this.message = 'Greska pri registraciji!';
          }
        }
      );
    }
    
    else if(this.userType == 'agency'){

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

      console.log(formData);
      // Log, to check if values are correctly stored
      for (const value of formData.values()) {
        console.log(value);
      }


      this.userService.registerAgency(formData).subscribe( (resp) => {

          if(resp['message'] == 'usernameNotUnique'){
            this.message = 'Korisnicko ime vec postoji u sistemu!';
          }

          else if(resp['message'] == 'emailNotUnique'){
            this.message = 'Email adresa vec postoji u sistemu!';
          }

          else if(resp['message'] == 'agencyIdNotUnique'){
            this.message = 'Maticni broj vec postoji u sistemu!';
          }

          else if(resp['message'] == 'registeredAgency'){
            this.message = 'Agencija uspesno registrovana!';
          }
          
          else{
            this.message = 'Greska pri registraciji!';
          }
        }
      );
    }
  }



}