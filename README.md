For First time open:
`npm install`

Then 
`ng serve`


#admin has its own dashboard

#user has the normal dashboard

* change the configuration in app.module.ts
`AngularFireModule.initializeApp(environment.firebase)`
* Also check the firebase config in the enviroments, firebase is Guy's data conncetion, firebase1 is frank's data connection

firebase DB structure
`
{
  "_email": "admin",
  "_password": "admin",
  "_username": "admin",
  "_url": "admin",
  "_role": "admin",
  "_active": true,
  "key": "-LhVQkZx0qbHMbVLoen1",
  "_port": "3000",
  "_userId": ""
}
`
