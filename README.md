Mail merge PDF service: 
============================

This project allow you to:

  - Send an email to the service containing multiple PDF Files, and then receive an email with one single PDF file.

Standard usage
------------------

Setup .env file

```
MAIL_USERNAME = your@email
MAIL_PASSWORD = yourPassword
IMAP_HOST = imap.gmail.com
IMAP_PORT = 993
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SSL = true
RESULT_MAIL_FROM = pdf-merge@gmail.com
RESULT_MAIL_SUBJECT = Merge result
RESULT_MAIL_MESSAGE = You got mail!
RESULT_MAIL_ATTACH_FILENAME = file.pdf
```

install dependencies

```
npm install
```

Set permissions on pdf-files folder

```
sudo chmod 777 pdf-files
```

Then just start the service

```
node app
