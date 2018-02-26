angular.module('SimpleFormApp').directive('phoneNumberValidator', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            function phoneNumberValidation(value) {
                if ((/^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/i).test(value)) {
                    ctrl.$setValidity('phoneNumberValidity', true);
                } else {
                    ctrl.$setValidity('phoneNumberValidity', false);
                }
                return value;
            }
            ctrl.$parsers.push(phoneNumberValidation);
        }
    };
});