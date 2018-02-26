angular.module('SimpleFormApp').directive('emailValidator', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            function emailValidation(value) {
                if ((/^[\S]+@[\S]+\.\S+/i).test(value)) {
                    ctrl.$setValidity('emailValidity', true);
                } else {
                    ctrl.$setValidity('emailValidity', false);
                }
                return value;
            }
            ctrl.$parsers.push(emailValidation);
        }
    };
});