curl -sSL https://mtmh-staging.khutwah.id | grep -q "$(git rev-parse --short f7e1751d7729ae6de4a430e1531e51dbef9ed75d)" || exit 1;
