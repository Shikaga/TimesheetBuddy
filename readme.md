# Specifying the URL

The URL for the server in index.html is not dynamic; this link is to create a bookmark bar shortcut.

The URL is currently hardcoded so should be modified once the deployment environment is known.

# Installing SSL Certificates

To get it working, generate the certificates and put them in a folder called 'private' in the server folder (this is excluded by the .gitignore)

# Setting up the certificates for the private directory

Use [this guide](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04)

Run this command for openssl:
`sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./key.key -out ./server.crt`

# CORS Anywhere

A dependecy of the FE is a slight tweak of the open source cors-anywhere project with the following additions:

in `cors-anywhere.js#withCORS` added the following:

```
  headers["Access-Control-Allow-Origin"] = "https://synergist.caplin.com"; // add your own origin here
  headers["Access-Control-Allow-Credentials"] = "true";
```

# Credentials.json

Follow these steps:

- Create a chrome developer account
- Setup a redirect domain in the oauth screen
- Add OAuth 2.0 client IDs for Web App
- Rename web app in the produced JSON to installed

Once you have done this, signing in will put the users Oauth link in the console. Follow this and log in, but you will need to get the Oauth token from somewhere (you may be able to log it in the network tab in chrome for instance).

This is an early version of the app so expect this to change. We would prefer to do this with a service accounts
