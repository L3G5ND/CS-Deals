let user
$.ajax({
    async: false,
    type: 'GET',
    url: 'account/info',
    success: function(userInfo) {
        user = userInfo.data
    }
})