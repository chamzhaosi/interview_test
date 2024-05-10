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
pip install django --break-system-packages
pip install djangorestframework --break-system-packages


