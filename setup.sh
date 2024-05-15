###############################################################################
### Sychornics server time
###############################################################################
su -
apt -y install chrony

###############################################################################
################################ Backend Part ################################
###############################################################################

###############################################################################
### Install Python3 and Related Library
###############################################################################

# Run as root
# Install Python
su -
apt -y install python3 python3-pip

# Verify Python version  
python3 --version # Python 3.11.2
exit

# Install python necessary library
su -
pip install django --break-system-packages
pip install djangorestframework --break-system-packages

# Incorrect validation
# pip install django-phonenumber-field[phonenumbers] --break-system-packages 
# pip install phonenumbers --break-system-packages

# To solve the problem of mysqlclient installation
# Refer: https://stackoverflow.com/questions/76585758/mysqlclient-cannot-install-via-pip-cannot-find-pkg-config-name-in-ubuntu
apt -y install python3-dev default-libmysqlclient-dev build-essential pkg-config

# Refer: https://www.geeksforgeeks.org/how-to-integrate-mysql-database-with-django/
pip install mysqlclient --break-system-packages
exit

python3 manage.py dbshell
DROP TABLE django_session;
TRUNCATE TABLE django_migrations;

###############################################################################
### Django
###############################################################################
# Create a project
django-admin startproject backend_test


###############################################################################
### Install MySQL (mariadb) in debain
###############################################################################
# Refer: https://linuxgenie.net/how-to-install-mariadb-on-debian-12-bookworm-distribution/
su -
apt -y update && apt -y dist-upgrade
apt -y install mariadb-server
mariadb-secure-installation
systemctl status mariadb
mysql -u root -p website # root@czs

## Create a database
CREATE DATABASE website;

# Create a new user
CREATE USER 'django'@'localhost' IDENTIFIED BY 'chamzhaosi';
GRANT ALL PRIVILEGES ON website.* TO 'django'@'localhost';
FLUSH PRIVILEGES;

# verify the user
SELECT user, host FROM mysql.user WHERE user = 'django';
SELECT user, host FROM mysql.user;

# if want to drop user
DROP USER 'django'@'localhost';

# use database;
USE website;

# exit
quit

###############################################################################
### Install Celery
###############################################################################
#Refer: https://www.codingforentrepreneurs.com/blog/celery-redis-django/
su -
apt -y install redis-server
pip install celery[redis] --break-system-packages
redis-cli ping
redis-server
systemctl status redis

# run celery
cd /home/engineer/interview_test/backend_test
celery -A backend_test worker -l info -E

###############################################################################
### Install Websockets
###############################################################################
#Refer: https://esketchers.com/django-websockets-a-complete-beginners-guide/
su -
pip install channels channels_redis daphne websocket-client --break-system-packages
daphne backend_test.asgi:application 

###############################################################################
### Implement celery listening
###############################################################################
su -
pip install aiohttp python-engineio "python-socketio[asyncio]" requests --break-system-packages

###############################################################################
### Redis service
###############################################################################
su -
/etc/init.d/redis-server restart
/etc/init.d/redis-server stop
/etc/init.d/redis-server start

###############################################################################
### Install JWT
###############################################################################
# Refer: https://medium.com/django-unleashed/securing-django-rest-apis-with-jwt-authentication-using-simple-jwt-a-step-by-step-guide-28efa84666fe
su -
pip install PyJWT django-cors-headers  --break-system-packages
# pip install djangorestframework_simplejwt django-cors-headers  --break-system-packages (use it in future)

###############################################################################
################################ Frontend Part ################################
###############################################################################

###############################################################################
### Install Node.js
###############################################################################
su -
apt -y update && apt -y dist-upgrade
apt -y install nodejs npm
node --version # v18.19.0
npm --version # 9.2.0

###############################################################################
### Start Angular
###############################################################################
npm install -g @angular/cli
ng version
npm init @angular frontend_test --no-standalone
# ng new --no-standalone

npm install bootstrap

# ngx-pagination not work, manully do pagination and sorting

# npm install ngx-pagination
# npm install jquery --save 
# npm install datatables.net --save 
# npm install datatables.net-dt --save 
# npm install datatables.net-responsive-dt --save 
# npm install angular-datatables --save 
# npm install @types/jquery --save-dev 
# npm install @types/datatables.net --save-dev 
# npm i @popperjs/core 
# npm install datatables.net-buttons --save 
# npm install datatables.net-buttons-dt --save 
# npm install @types/datatables.net-buttons --save-dev 
# npm install jszip --save
# rm -rf node_modules
# rm package-lock.json
# npm install
###############################################################################
### run server with ssl key and cert
###############################################################################
su - 
pip install django-extensions Werkzeug --break-system-packages
export DJANGO_SETTINGS_MODULE=backend_test.settings

cd /home/engineer/interview_test/backend_test
# python3 manage.py runserver_plus --key-file /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem --cert-file /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem
# daphne -e ssl:8000:privateKey=/etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem:certKey=/etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem backend_test.asgi:application
python3 manage.py runserver 0.0.0.0:8000

cd /home/engineer/interview_test/frontend_test
# ng serve --host 0.0.0.0 --ssl true --ssl-key /etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem --ssl-cert /etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem
ng serve --host 0.0.0.0 

###############################################################################
### Configure Nginx as a Web Proxy
###############################################################################

# chamzhaosi.com
# metropolice.chamzhaosi.com
cp /home/engineer/chamzhaosi.com-sub-fullchain.pem /etc/nginx/ssl/
cp /home/engineer/chamzhaosi.com-sub-privkey.pem /etc/nginx/ssl/

cat > /etc/nginx/conf.d/metropolice.chamzhaosi.com.conf << EOF
server {
  listen 80;
  listen [::]:80;
  server_name metropolice.chamzhaosi.com;
  rewrite ^ https://metropolice.chamzhaosi.com\$request_uri? permanent;
}
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  ssl_certificate /etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem;
  server_name metropolice.chamzhaosi.com;
  location / {
    proxy_pass http://192.168.0.170:4200/;
  }
  location /ws {
    # proxy_pass http://192.168.0.170:8000/ws;
    proxy_pass http://192.168.0.170:8000/ws;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "Upgrade";
  }
  # Py Django
  location /api {
      proxy_pass http://192.168.0.170:8000/api;
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;
  }
  # Py Django
  location /admin {
      proxy_pass http://192.168.0.170:8000/admin;
      proxy_set_header Host \$host;
      proxy_set_header X-Real-IP \$remote_addr;
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF
/etc/init.d/nginx restart

# https://192.168.0.170:8000/admin/
# https://metropolice.chamzhaosi.com/admin/

###############################################################################
### Run Required Command in Screen Mode
###############################################################################
su -
whoami
# root
apt -y install screen
exit
whoami
# username

# Check Port and Screen Process - BEFORE
screen -ls
ss -tunpl | grep '8000\|4200\|6379'

# Run Screen Process
screen -S django -dm bash -c 'cd /home/engineer/interview_test/backend_test && python3 manage.py runserver 0.0.0.0:8000'
screen -S angular -dm bash -c 'cd /home/engineer/interview_test/frontend_test && ng serve --host 0.0.0.0'
screen -S celery -dm bash -c 'cd /home/engineer/interview_test/backend_test && celery -A backend_test worker -l info -E'

# Check Port and Screen Process - AFTER
screen -ls
ss -tunpl | grep '8000\|4200\|6379'

# Kill Screen Process
screen -S django -X quit
screen -S angular -X quit
screen -S celery -X quit

###############################################################################
