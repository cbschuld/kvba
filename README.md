# KVBA (A RESTful, serverless key-value store with Basic Auth)
> A [serverless](https://serverless.com/) based AWS lambda and api gateway enabled key/value store with Basic HTTP Authorization and weak obfuscated account creation.  All keys are partitioned by user scope thus each user maintains their own domain of keys.  Cross-Origin resource sharing (CORS) is also available via the serverless to add protection for call origin.

## Endpoints
**/auth** via **POST** (for account creation and verification)

**/put** via **POST** to add a value to the key/value store

**/get** via **GET** to retrieve a value from the key/value store

## Building
```
export AWS_PROFILE=YOUR_AWS_PROFILE
export AWS_DEFAULT_REGION=us-west-2
npm install
```

### Creating your own
+ Add your profile to the serverless.yml file
+ Add your domains to the serverless if you intend to manage the domains and API gateway with serverless
+ Update the serverless.yml file with other options for your domain(s)

## Testing
testing uses [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Chai HTTP](https://github.com/chaijs/chai-http)
```
npm test
```

## License

(The MIT License)

Copyright (c) Chris Schuld <chris@chrisschuld.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.