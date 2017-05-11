#!/usr/bin/env python
import json
import os
import zipfile
import re

man = json.loads(open("manifest.json").read())
version = man["version"]
print("Building version: "+version)
print("")
print("Files >>")

man.pop('applications', None)

with open("chrome-manifest.json", "w") as outfile:
	json.dump(man, outfile)

includes = ['.git']

def zipdir(path, ziph, manifest):
	# ziph is zipfile handle
	for file in os.listdir(path):
		pj = file
		if "git" not in pj and ".py" not in pj:
			if pj.endswith(".json"):
				if(pj!=manifest):
					continue
				else:
					print("Manifest", file)
					ziph.write(file, "./manifest.json")
			else:
				print(file)
				ziph.write("./"+file, file)

if __name__ == '__main__':
	print("Chrome dist:")
	ff = "../spigot_graphs_chrome_"+version+".zip"
	zipf = zipfile.ZipFile(ff, 'w', zipfile.ZIP_DEFLATED)
	zipdir('./', zipf, "chrome-manifest.json")
	zipf.close()
	os.rename(ff, ff[1:])

	print("Firefox dist:")
	ff = "../spigot_graphs_firefox_"+version+".zip"
	zipf = zipfile.ZipFile(ff, 'w', zipfile.ZIP_DEFLATED)
	zipdir('./', zipf, "manifest.json")
	zipf.close()
	os.rename(ff, ff[1:])
	print("Build ended...")
