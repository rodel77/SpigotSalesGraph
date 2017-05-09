import os
import shutil
import sys
from shutil import copyfile

if not os.path.exists("dist"):
	os.makedirs("dist")
else:
	shutil.rmtree("dist")
	os.makedirs("dist")

def cmd(string):
	os.system(string)

print("Fetching all files...")

jsfiles = []

for filem in os.listdir('.'):
	pj = filem
	if pj.endswith(".png") or pj.endswith(".log") or pj.endswith(".json"):
		print(pj+" copied...")
		copyfile(pj, "./dist/"+pj)
	if pj.endswith(".js") and "node_modules" not in pj and "dist" not in pj:
		# copyfile(pj, "./dist/"+pj[2::])
		jsfiles.append(pj);

print(len(jsfiles), "files found!")

index = 0
for ff in jsfiles:
		index+=1
		cmd("babel "+ff+" --out-file ./dist/"+ff)
		print(ff+" dist created... (", index, "/", len(jsfiles), ")")
cmd("build")