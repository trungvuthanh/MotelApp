from models.user import User
from models.connectDatabase import ConnectDatabase

class Owner(User):
    def __init__(self, username, password, fullname , phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt):
        self.username = username
        self.password = password
        self.fullname = fullname
        self.phoneNumber = phoneNumber
        self.email = email
        self.birthday = birthday
        self.ID = ID
        self.imageID = imageID
        self.addressProvince = addressProvince
        self.addressDistrict = addressDistrict
        self.addressWard = addressWard
        self.addressDetail = addressDetail
        self.typeAvt = typeAvt
    
    def signup(self):
        """
        Đăng ký tài khoản của Chủ nhà trọ => Đưa vào danh sách chờ duyệt
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = """
            INSERT INTO owner(username, password, fullname , phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, username, password, fullname , phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt)
        connectDatabase.connection.commit()
        count = rows.rowcount
        if count == 0:
            # chưa có tài khoản nào có tên đăng nhập trùng
            connectDatabase.close()
            return "not_exist"
        # tồn tại tài khoản trùng tên đăng nhập
        connectDatabase.close()  
        return "exist"