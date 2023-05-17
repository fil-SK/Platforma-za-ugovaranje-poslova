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
  wrongImageDimensions : string;

  selectedImage(event){
    if(event.target.files.length > 0){
      this.image = event.target.files[0];     // Get the image

      // Check for the image resolution
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

    // Validate image dimensions
    if(this.imageWidth < 100 || this.imageWidth > 300 || this.imageHeight < 100 || this.imageHeight > 300){
      this.wrongImageDimensions = "Rezolucija slike nije u dozvoljenom opsegu! Slika moze biti minimalne rezolucije 100x100 i maksimalne rezolucije 300x300 piksela!";
      return;
    }


    // Validation passed, continue

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


    if(this.userType == 'client'){
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
      this.userService.registerAgency(this.agencyName, this.agencyAddress, this.streetNumber, this.city, this.state, this.agencyId, this.description,
        this.username, this.password, this.phoneNumber, this.email).subscribe( (resp) => {

          if(resp['message'] == 'usernameNotUnique'){
            this.message = 'Korisnicko ime vec postoji u sistemu!';
          }

          else if(resp['message'] == 'emailNotUnique'){
            this.message = 'Email adresa vec postoji u sistemu!';
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