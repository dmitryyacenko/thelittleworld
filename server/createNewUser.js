Accounts.validateNewUser(function (user) {
    if (
        AllowedUsers.find(
            {
                vk_id: user.services.vk.id
            }).count() == 0
    ) {
        throw new Meteor.Error(403, `User ${user.services.vk.id} is not allowed`);
    }
    return true;
});