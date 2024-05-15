# Generate SSL Cerst
apt -y install python3-certbot-apache certbot python3-pip
pip3 install --break-system-packages certbot-dns-cloudflare
systemctl disable apache2
systemctl stop apache2

cat > /etc/letsencrypt/dnscloudflare.ini << EOF
# CloudFlare API key information
dns_cloudflare_api_key = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
dns_cloudflare_email = chamzhaosi@gmail.com
EOF
chmod 644 /etc/letsencrypt/dnscloudflare.ini

certbot certificates

certbot delete --noninteractive --cert-name chamzhaosi.com
# Generate main domain SSL certs
certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/dnscloudflare.ini -d chamzhaosi.com
# Generate wild card sub-domain SSL certs
certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/dnscloudflare.ini -d *.chamzhaosi.com
# Install SSL

mkdir /etc/nginx/ssl/
touch /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem
touch /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem

cat /etc/letsencrypt/live/chamzhaosi.com/privkey.pem > /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem
cat /etc/letsencrypt/live/chamzhaosi.com/fullchain.pem > /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem
cat /etc/letsencrypt/live/chamzhaosi.com-0001/privkey.pem > /etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem
cat /etc/letsencrypt/live/chamzhaosi.com-0001/fullchain.pem > /etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem

cat /etc/nginx/ssl/chamzhaosi.com-main-privkey.pem
cat /etc/nginx/ssl/chamzhaosi.com-main-fullchain.pem

cat /etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem
cat /etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem


scp /etc/nginx/ssl/chamzhaosi.com-sub-privkey.pem engineer@192.168.0.11:/home/engineer/
scp /etc/nginx/ssl/chamzhaosi.com-sub-fullchain.pem engineer@192.168.0.11:/home/engineer/
