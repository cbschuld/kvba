'use strict'

const dynamodb = require('./dynamodb')

const returnPayload = (status, payload_body_object) => {
  return {
    statusCode: status,
    body: JSON.stringify(payload_body_object),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }
}

module.exports.auth = async (event, context) => {
  const authorizationHeader = event.headers.Authorization
  if (!authorizationHeader) {
    return returnPayload(403, {
      message: 'Unable to Authorize',
    })
  }

  const encodedCreds = authorizationHeader.split(' ')[1]
  const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':')
  const username = plainCreds[0]
  const password = plainCreds[1]

  if ('' === username || '' === password) {
    return returnPayload(403, {
      message: 'Unable to Authorize',
    })
  }

  const params = {
    TableName: process.env.DYNAMODB_DATASTORE_AUTH_TABLE,
    Key: {
      username: username,
    }
  }

  return await dynamodb.get(params).promise().then(async (result) => {
    if ('Item' in result) {
      if (result.Item.password === password) {
        return returnPayload(200, {
          message: 'Authorization valid'
        })
      }
      else {
        return returnPayload(403, {
          message: 'Authorization invalid'
        })
      }
    }

    var putParams = {
      TableName: process.env.DYNAMODB_DATASTORE_AUTH_TABLE,
      Item: {
        'username': username,
        'password': password
      }
    }
    return await dynamodb.put(putParams).promise().then(() => {
      return returnPayload(400, {
        message: 'Authorization valid'
      })
    }).catch((error) => {
      return returnPayload(501, { error: error })
    })

  }).catch((error) => {
    return {
      statusCode: 501,
      body: JSON.stringify({
        error: error
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  })
}

module.exports.get = async (event, context) => {
  const authorizationHeader = event.headers.Authorization
  if (!authorizationHeader) {
    return returnPayload(400, { message: 'Unable to Authorize' })
  }

  const encodedCreds = authorizationHeader.split(' ')[1]
  const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':')
  const username = plainCreds[0]
  const password = plainCreds[1]
  const key = ('pathParameters' in event && 'key' in event.pathParameters) ? event.pathParameters.key : ''

  if ('' === username || '' === password) {
    return returnPayload(400, { message: 'Unable to Authorize', })
  }
  const params = {
    TableName: process.env.DYNAMODB_DATASTORE_AUTH_TABLE,
    Key: {
      username: username,
    },
  }
  return await dynamodb.get(params).promise().then(async (result) => {
    if ('Item' in result) {
      if (result.Item.password === password) {
        const computed_key = Buffer.from(username + '_' + key).toString('base64')
        const getParams = {
          TableName: process.env.DYNAMODB_DATASTORE_KVBA_TABLE,
          Key: {
            username_key_base64: computed_key,
          },
        }
        return await dynamodb.get(getParams).promise().then((result) => {
          let value = ''
          console.log(result)
          if ('Item' in result) {
            console.log(result.Item)
            value = ('value' in result.Item ? result.Item.value : '')
          }
          return returnPayload(200, { key: key, value: value })
        }).catch((error) => {
          return returnPayload(501, { message: 'Error: could not read value from store', error: error })
        })
      }
    }
    return returnPayload(400, { message: 'Authorization Invalid' })
  }).catch((error) => {
    return returnPayload(500, { message: 'Error: could not read user info from store.', error: error })
  })
}

module.exports.set = async (event, context) => {
  const authorizationHeader = event.headers.Authorization
  if (!authorizationHeader) {
    return returnPayload(400, { message: 'Unable to Authorize' })
  }

  const encodedCreds = authorizationHeader.split(' ')[1]
  const plainCreds = (new Buffer(encodedCreds, 'base64')).toString().split(':')
  const username = plainCreds[0]
  const password = plainCreds[1]
  const key = ('pathParameters' in event && 'key' in event.pathParameters) ? event.pathParameters.key : ''
  const requestBody = JSON.parse(event.body)
  const value = ('value' in requestBody ? requestBody.value : '')

  if ('' === username || '' === password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Unable to Authorize',
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    }
  }
  const params = {
    TableName: process.env.DYNAMODB_DATASTORE_AUTH_TABLE,
    Key: {
      username: username,
    },
  }
  return await dynamodb.get(params).promise().then(async (result) => {
    if ('Item' in result) {
      if (result.Item.password === password) {
        const computed_key = Buffer.from(username + '_' + key).toString('base64')
        const setParams = {
          TableName: process.env.DYNAMODB_DATASTORE_KVBA_TABLE,
          Item: {
            username_key_base64: computed_key,
            key: key,
            username: username,
            value: value
          },
        }
        return await dynamodb.put(setParams).promise().then(() => {
          return returnPayload(200, { key: key, value: value })
        }).catch((error) => {
          return returnPayload(500, { message: 'Error: could not write value to store', error: error })
        })
      }
    }
    return returnPayload(400, { message: 'Authorization Invalid' })
  }).catch((error) => {
    return returnPayload(500, { message: 'Error: could not read user info from store.', error: error })
  })
}