import numpy as np
import math
import subprocess

def mean(values):
	if len(values) == 0:
		return None
	return sum(values, 0.0) / len(values)

def stdev(values, option):
	if len(values) < 2:
		return None

	sd = 0.0
	sum = 0.0
	meanValue = mean(values)

	for i in range(0, len(values)):
		diff = values[i] - meanValue
		sum += diff * diff

	sd = math.sqrt(sum / (len(values) - option))
	return sd

iter = 1000

print('example')
time = []
for i in range(iter):
	time.append(int(subprocess.check_output ('node example.js' , shell=True)))
print('mean: ' + str(mean(time)))
print('std: ' + str(stdev(time, 1)))
print('max: ' + str(max(time)))
print('min: ' + str(min(time)))

print('example_inst')
time = []
for i in range(iter):
	time.append(int(subprocess.check_output ('node example_inst.js' , shell=True)))
print('mean: ' + str(mean(time)))
print('std: ' + str(stdev(time, 1)))
print('max: ' + str(max(time)))
print('min: ' + str(min(time)))
