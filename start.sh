#!/bin/bash

echo "Starting twtask server in background..."
nohup ./bin/twtask > twtask.log 2>&1 &
tail -vf twtask.log &

# Ensure we are ready to run tests
npm install -s
npm run test 

echo "Tests done. Starting report server..."
npm run serve