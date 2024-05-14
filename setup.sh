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
pip install django-phonenumber-field[phonenumbers] --break-system-packages
pip install phonenumbers --break-system-packages

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

###############################################################################
### run server with ssl key and cert
###############################################################################
su - 
pip install django-extensions Werkzeug --break-system-packages
export DJANGO_SETTINGS_MODULE=backend_test.settings

cd /home/engineer/interview_test/backend_test
# python3 manage.py runserver_plus --key-file /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem --cert-file /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem
daphne -e ssl:8000:privateKey=/etc/nginx/ssl/chamzhaosi.com-main-privkey.pem:certKey=/etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem backend_test.asgi:application

cd /home/engineer/interview_test/frontend_test
ng serve --ssl true --ssl-key /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem --ssl-cert /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem