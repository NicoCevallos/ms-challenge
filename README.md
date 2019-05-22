# Basic Blog

## How to run

Yo need to run `docker-compose up` to create the container with the MongoDB database, and then run the test or application with the scripts `test` and `start` (or `start:watch`). The same can be done with the script `start:dock`.

If you don't have or cannot run Docker, check the file `src/models/index.ts` to update the URL to connect to the MongoDB instance.

## Authors

The entry `api/authors` has the basic CRUD operations to manage authors: create, get all, get by id, update by id, delete by id.

The Author model is:
```
{
    name: string,
    password: string
}
```

## Login

The entry `api/auth/login` accepts POST method to log in into the application. The user and password should be sent with the value `application/x-www-form-urlencoded` in the header `Content-Type` and the body with the following format `username={author.name}&password={author.password}`.

When calling this endpoint with valid credentials, it will return the Cookie `connect.sid`, which is needed to call `api/auth/me` and `api/posts`.

## Me
The entry `api/auth/me` accepts GET method and is a checkpoint to control if the user is logged in.

## Logout
The entry `api/auth/logout` accepts POST method to log out.

## Posts

The entry `api/posts` has the basic CRUD operations to manage authors: create, get all, get by id, update by id, delete by id.

To manage Posts you first need to be logged in.

The Post model is:
```
{
    title: string,
    body: string,
    status: "draft" | "private" | "public"
}
```

`GET api/posts` also accepts the query string parameter `search` to be used as a text search into the post's title and/or body.
