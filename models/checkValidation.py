import re 

class CheckValidation:
    
    @staticmethod
    def isFullname(fullname):
        return len(fullname) > 2 and len(fullname) < 25
        
    @staticmethod
    def isPhoneNumber(phoneNumber):
        return phoneNumber.isnumeric() and len(phoneNumber) == 10 and phoneNumber[0] == "0"
    
    @staticmethod
    def isEmail(email):
        regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
        if (re.search(regex,email)):  
            return True
        return False     
    
    
# print(CheckValidation.isEmail("abc@gmail.com"))
# print(CheckValidation.isPhoneNumber("0983298920"))