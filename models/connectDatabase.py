import pyodbc 
import time

class ConnectDatabase:
    """
    Class dùng để connect với Database sử dụng Data Object (pyodbc)

    ...

    Attributes
    ----------
    connection : pyodbc.Connection
        biến dùng để connect với remotemysql
        
    cursor : pyodbc.Cursor
        biến cursor của connection vừa kết nối với remotemysql

    """
    # 2 biến static
    def __init__(self):
        tt = time.time()
        self.connection = pyodbc.connect("DRIVER={MySQL ODBC 8.0 Unicode Driver};SERVER=localhost;DATABASE=motelapp;USER=root;PASSWORD=;")
        self.cursor = self.connection.cursor() 
        print(time.time() - tt, 1)   
    
    def close(self):
        self.connection.close()  
