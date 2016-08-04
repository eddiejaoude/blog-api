[![Build Status](https://travis-ci.org/eddiejaoude/blog-api.svg?branch=master)](https://travis-ci.org/eddiejaoude/blog-api)

# API

API using ExpressJS.

## Dependencies

* ExpressJS
* SequelizeJS

## Installation / Setup

* Change DB config in `config/config.json`
* Create the empty database
* Install dependencies `npm install`
* Run server `DEBUG=api:* npm start` *note will create the database*
* Visit `http://localhost:3000/`

### Testing

* Run `npm test` *note: server does not need to be running & will run migrations*

Or to run in parallel `./node_modules/.bin/mocha-parallel-tests test`, note: output is more difficult to read.

### Migrations

* `./node_modules/sequelize-cli/bin/sequelize db:migrate`

## End points

### Tags

* [GET] `/tags`
* [GET] `/tags/{id}` *Note: This will include all blog posts with this Tag*
* [POST] `/tags`
* [PUT] `/tags/{id}`
* [DELETE] `/tags/{id}`

#### Example Tag object

```json
{
    "id": 1,
    "name": "Tag Name",
    "createdAt": "2016-08-01T12:49:30.000Z",
    "updatedAt": "2016-08-02T08:44:11.000Z"
}
```

### Posts

* [GET] `/posts`
* [GET] `/posts/{id}`
* [POST] `/posts`
* [PUT] `/posts/{id}`
* [DELETE] `/posts/{id}`

#### Example Post object

```json
{
    "id": 1,
    "title": "Blog post title",
    "description": "Blog post description",
    "createdAt": "2016-08-01T17:46:26.000Z",
    "updatedAt": "2016-08-01T17:46:26.000Z",
    "tags": [
      {
        "id": 1,
        "name": "Tag Name"
      }
    ]
}
```

*Note: Only `tag.id` is required on `POST` & `PUT`, the `tag.name` is in `GET`*

## Future considerations

* Services & move logic out of the Controllers
* Repository layer
* Authentication
* Pagination
* Hypermedia HAL
* Move Controller logic to Service 
