
[documents in postman](https://documenter.getpostman.com/view/18880880/2s9YkrazV2)

### response example true

```js
{
    "success": true,
    "message" : ""
    "data": {
       "notifications": []
    }
}
```

### response example fail

```js
{
    "success": false,
    "error": {
        "message": "Bạn đã tham gia sự kiện này"
    }
}
```



### admin

```shell
admin/attendance/:eventID  #GET

admin/notification/:clubID  #POST
admin/notification/:notificationID #PUT
admin/notification/:notificationID #DELETE

admin/event/:clubID/create #POST
admin/event/:eventID #DELETE
admin/event/:eventID #PUT

admin/club #POST
admin/club #GET
admin/clubs #GET
admin/club/:clubID/addMember #POST
admin/club/:clubID/removeMember #POST
admin/club/:clubID #DELETE
admin/club/:clubID #PUT
```

### user

```shell
event/:eventID/getEvent  #GET
event/:clubID  #GET
event/:eventID/attendance  #POST
event/:eventID/attendance  #GET

notification/:clubID  #GET
notification/:clubID/read #GET

club/:clubID #GET
club #GET

user #GET
user/change-password #POST

auth/login #POST
auth/forget-session #POST
auth/register #POST
```
