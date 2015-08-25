var PH = {
    
    path: 'http://10.0.1.3/api/',

    init: function (){

        $('#create_user').click(function (){

            var url = $('#user').val();
            var method = 'POST';
            var data = '{"devicetype":"test user","username":'+$('#user').val()+'}';
            PH.ajax(url, method, data);

        });

        $('#list').click(function (){
            
            var url = $('#user').val() + '/lights';
            var method = 'GET';
            var data = '';
            PH.ajax(url, method, data);

        });

        $('#get').click(function (){
            
            var url = $('#user').val() + '/lights/' + $('#light').val();
            var method = 'GET';
            var data = '';
            PH.ajax(url, method, data);

        });

        $('#on').click(function (){
            
            var url = $('#user').val() + '/lights/' + $('#light').val() + '/state';
            var method = 'PUT';
            var data = '{"on":true}';
            PH.ajax(url, method, data);

        });

        $('#off').click(function (){
            
            var url = $('#user').val() + '/lights/' + $('#light').val() + '/state';
            var method = 'PUT';
            var data = '{"on":false}';
            PH.ajax(url, method, data);

        });

        $('#update').click(function (){
            
            var url = $('#user').val() + '/lights/' + $('#light').val() + '/state';
            var method = 'PUT';
            var data = '{"on":true, "sat":' + $('#sat').val() + ', "bri":' + $('#bri').val() + ',"hue":' + $('#hue').val() + '}';
            PH.ajax(url, method, data);

        });

    },

    ajax: function (url, method, data){

        // console.log(url);
        // console.log(method);
        // console.log(data);

        $.ajax({
            url: PH.path + url,
            type: method,
            contentType: "application/json",
            data: data,
            error: function (e){
                console.log(e);
            },
            success: function(res) {
                $('#output').html('<pre>' + JSON.stringify(res) + '</pre>');
            }
        });

    }

};

$(function (){ PH.init(); });