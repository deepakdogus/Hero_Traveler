#!/usr/bin/env bash
docker build --no-cache -t rwoody/ht-api --build-arg NPM_TOKEN=${NPM_TOKEN} .
