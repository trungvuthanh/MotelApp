import pyodbc 
import time

class ConnectDatabase:
    """
    Class dùng để connect với Database sử dụng Data Object (pyodbc)

    ...

    Attributes
    ----------
    __init__() : constructor
        
    close(): đóng kết nối

    """
    def __init__(self):
        """
        Constructor
        
        Parameters
        ----------
        None
        """
        self.connection = pyodbc.connect("DRIVER={MySQL ODBC 8.0 Unicode Driver};SERVER=localhost;DATABASE=motelapp;USER=root;PASSWORD=;")
        self.cursor = self.connection.cursor()  
    
    def close(self):
        """
        Đóng kết nối với database
        
        Parameters
        ----------
        None
        """
        self.connection.close()  
