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

# To solve the problem of mysqlclient installation
# Refer: https://stackoverflow.com/questions/76585758/mysqlclient-cannot-install-via-pip-cannot-find-pkg-config-name-in-ubuntu
apt -y install python3-dev default-libmysqlclient-dev build-essential pkg-config

# Refer: https://www.geeksforgeeks.org/how-to-integrate-mysql-database-with-django/
pip install mysqlclient --break-system-packages
exit

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
mysql -u root -p # root@czs

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

# exit
quit


