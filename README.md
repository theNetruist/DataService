#AeonTek-Hermes-DataService
A Javascript package to allow the sending and receiving of data.

##Usage
```
DataService.get('https://www.aeontek.org').response();

```

Get JSON formatted response
```

DataService.get(url).json();

```

Get File response ({filename, blob})
```

DataService.get(url).file();

```

Get Http Response without any formatting
```

DataService.get(url).request();

```

Allows the following HttpMethods:
```

DataService.get(url); //GET
DataService.post(url, body); //POST
DataService.put(url, body); //PUT
DataService.patch(url, body); //PATCH
DataService.delete(url); //DELETE

```

###Base Path
Set a base path, and all future calls will use that base path:
```

DataService.setBasePath('https://www.aeontek.org');
...

DataService.get('myJsonpath').json(); //sends response to 'https://www.aeontek.org/myJsonPath'

```

###Redirect Url
Set a Redirect URL, and upon a 401 response, DetaService will redirect to the given url.
```

DataService.setRedirectUrl('https://www.aeontek.org/login');
...

DataService.get('throw401').json(); //redirects to 'https://www.aeontek.org/login'

```

###Modify Headers
```

DataService.addHeader('cheese', 'cake');
DataService.get(url).json(); //Request will have header cheese: cake
DataService.removeHeader('cheese');
DataService.get(url).json(); //Request will not have cheese header

```

###Force Reload
Some browsers cache pages or static data calls to make loading faster, especially on reloads or navigations. To bypass that, DataService can add a random value to the query.

To force reload all data calls (only affects GETs):
```

DataService.setAlwaysForceStaticReload(true);

```

To force reload a single data call:
```

DataService.get(url, true);

```

```
