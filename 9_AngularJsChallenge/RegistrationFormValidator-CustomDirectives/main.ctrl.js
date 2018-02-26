var app = angular.module('SimpleFormApp', []);

app.controller('formCtrl', function($scope){
    this.registered = false;
    this.errors = false;
    
    this.user = {
        firstName: '',
        lastName: '',
        email: '',
        password: '', 
        phoneNum: ''
    };
    
    this.submit = function(){
        if($scope.registrationForm.$valid) {
            console.log("User is valid!");
          this.registered = true;
        }else{
          // If form is invalid, show errors
          console.log("User is invalid");
          this.registered = false;
          this.errors = true;
        }
    }
    
    this.reset = function(){
        this.registered = false;
        this.errors = false;
        this.user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '', 
            phoneNum: ''
        };
    }
    
});
