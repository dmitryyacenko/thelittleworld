ServiceConfiguration.configurations.remove({
    service: 'vk'
});

ServiceConfiguration.configurations.insert({
    service: 'vk',
    appId:   '5619877',       // Your app id
    secret:  'hkon3LbQgWRlTgVGp9zL', // Your app secret
    scope:   'email,status'   // Your app scope
});

if(AllowedUsers.find().count()==0){
    AllowedUsers.insert({
        'vk_id':59660161
    })
}