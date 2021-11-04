# MernCoffee-Web
 
This branch to deploy on heroku.

## Note:

* Please set port to: 443

## Deploy `staging` local branch to branch `master` Heroku

```
$ git remote add staging https://git.heroku.com/mern-coffee.git
$ git push staging staging:master
```

If miss some commit, you can add `-f` end command: 

``` 
$ git push staging staging:master -f
```

## Deploy in main project
```
$ git remote add heroku https://git.heroku.com/mern-coffee.git

$ git push heroku master
```

## If you using SSH protocol remote?
```
$ git remote add staging git@heroku.com:mern-coffee.git
$ git remote add heroku git@heroku.com:mern-coffee.git
```

## List your git remote
```
git remote -v
```
