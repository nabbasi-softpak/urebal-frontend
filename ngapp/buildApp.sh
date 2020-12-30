#!/bin/bash -v
echo Please wait, application is being started
ng serve --base-href=/app/ --deploy-url=/app/ --host=0.0.0.0 --disable-host-check -o
