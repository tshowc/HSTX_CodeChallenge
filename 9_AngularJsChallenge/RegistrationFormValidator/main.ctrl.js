var app = angular.module('SimpleFormApp', []);

app.controller('formCtrl', function(){
    this.registered = false;
        this.user = {
        firstName: '',
        lastName: '',
        email: '',
        password: '', 
        phoneNum: ''
    };
    
    this.submit = function(){
        this.registered = true;
    }
    
    this.reset = function(){
        this.registered = false;
        this.user = {
            firstName: '',
            lastName: '',
            email: '',
            password: '', 
            phoneNum: ''
        };
    }
    
});

