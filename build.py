#!/usr/bin/env python
import json
import os
import zipfile
import re

version = json.loads(open("manifest.json").read())["version"]
print("Building version: "+version)
print("")
print("Files >>")

includes = ['.git']

def zipdir(path, ziph):
	# ziph is zipfile handle
	for file in os.listdir(path):
		pj = file
		if "git" not in pj and ".py" not in pj:
			print(file)
			ziph.write("./dist/"+file, file)

if __name__ == '__main__':
	ff = "./SpigotGraphs "+version+".zip"
	zipf = zipfile.ZipFile(ff, 'w', zipfile.ZIP_DEFLATED)
	zipdir('./dist/', zipf)
	zipf.close();
	#os.rename(ff, ff[1:])
	print("Build ended...")
