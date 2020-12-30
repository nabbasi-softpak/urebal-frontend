echo Please wait, application is being started

if exist node_modules (
ng serve --base-href=/app/ --deploy-url=/app/ --host=0.0.0.0 --port=80 --disable-host-check
) else (
npm install
ng serve --base-href=/app/ --deploy-url=/app/ --host=0.0.0.0 --port=80 --disable-host-check
)


