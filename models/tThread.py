import threading
import time
import random
random.seed(2)

class TThread():
    def __init__(self, members, worker):
        self.g = []
        for member in members:
            t = threading.Thread(target=worker, args=(member, ))
            t.start()
            g.append(t)
            
        while (any([x.is_alive() for x in g])):
            pass
        self.result = "OK"