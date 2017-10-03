#!/usr/bin/env python
import json
import os
import zipfile
import re

version = json.loads(open("manifest.json").read())["version"]
print("Building version: "+version)
print("")
print("Files >>")

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            pj = os.path.join(root, file)
            if ".zip" not in pj and "git" not in pj and ".py" not in pj:
                print(file)
                ziph.write(pj)

if __name__ == '__main__':
    ff = "./spigot_graphs_dist_"+version+".zip"
    zipf = zipfile.ZipFile(ff, 'w', zipfile.ZIP_DEFLATED)
    zipdir('./', zipf)
    zipf.close()
    print("Build ended...")