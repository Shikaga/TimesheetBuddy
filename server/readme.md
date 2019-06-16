# Installing SSL Certificates

To get it working, generate the certificates and put them in a folder called 'private' in the server folder (this is excluded by the .gitignore)

# Setting up the certificates for the private directory

Use [this guide](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04)

Run this command for openssl:
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./key.key -out ./server.crt`
