from models.connectDatabase import ConnectDatabase
import unidecode
class Address:
    """
    Class địa chỉ (dùng cho các bộ selection và check validation)

    ...

    Static Methods
    ----------
    checkAddress(province, district, ward): bool
    
    getProvince(): list
    
    getDistrict(province: str): list   
    
    getWard(province: str, district: str): list     
    """
    
    @staticmethod
    def checkAddress(province, district, ward):
        """
        Kiểm tra bộ 3 (tỉnh/thành phố, quận/huyện, phường/xã) có tồn tại thực tế hay không
        
        Parameters
        ----------
        province: str (tên tỉnh/thành phố)
        
        district: str (tên quận/huyện)
        
        ward: str (tên phường xã)
        """
        query_str = "SELECT COUNT(*) FROM address WHERE province = ? AND district = ? AND ward = ?"
        connectDatabase = ConnectDatabase()
        count = connectDatabase.cursor.execute(query_str, province, district, ward).fetchval()
        return True if count == 1 else False
    
    @staticmethod
    def getProvince():
        """
        Trả về danh sách các tỉnh/thành phố
        
        Parameters
        ----------
        None
        """
        query_str = "SELECT DISTINCT(province) as 'province' FROM address"
        connectDatabase = ConnectDatabase()
        result = [row.province for row in connectDatabase.cursor.execute(query_str).fetchall()]
        connectDatabase.close()
        return result
    
    @staticmethod
    def getDistrict(province):
        """
        Trả về danh sách các phường/xã theo tỉnh/thành phố tương ứng
        
        Parameters
        ----------
        province: str (tên tỉnh/thành phố)
        """
        query_str = "SELECT DISTINCT(district) as 'district' FROM address WHERE province = ?"
        connectDatabase = ConnectDatabase()
        result = [row.district for row in connectDatabase.cursor.execute(query_str, province).fetchall()]
        connectDatabase.close()
        return result
    
    @staticmethod
    def getWard(province, district):
        """
        Trả về danh sách các quận/huyện theo tỉnh/thành phố và quận/huyện tương ứng
        
        Parameters
        ----------
        province: str (tên tỉnh/thành phố)
        
        district: str (tên quận/huyện)
        """
        query_str = "SELECT DISTINCT(ward) as 'ward' FROM address WHERE province = ? AND district = ?"
        connectDatabase = ConnectDatabase()
        result = [row.ward for row in connectDatabase.cursor.execute(query_str, province, district).fetchall()]
        connectDatabase.close()
        return result
    
    @staticmethod
    def normalizeProvince(province):
        for p in Address.getProvince():
            if "-".join(unidecode.unidecode(p).lower().split(" ")) == province:
                return p
        return None
    
    @staticmethod
    def normalizeDistrict(provinceNormal, district):
        for d in Address.getDistrict(provinceNormal):
            if "-".join(unidecode.unidecode(d).lower().split(" ")) == district:
                return d
        return None