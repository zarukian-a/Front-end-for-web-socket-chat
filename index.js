

    function connect(token){
        	if (typeof window.connected !== "undefined" || window.connected === false) {
        		console.log("alredy connected")
        		return;
            }

          const socket = new WebSocket('ws://localhost:9192/chat');
        const ws = Stomp.over(socket);
        
          ws.debug = function (str) {
                console.log("Debug: " + str)
            }

            ws.error = function (str) {
                console.error("error: " + str)
            }



            let authorization = "Bearer " + token;
            
            ws.connect({
                Authorization: authorization
            }, function (frame) {
                console.log("connected")
                window.connected = true

                // Receive Messages
                ws.subscribe("/topic/messages", function (message) {
                    let bodyObj = JSON.parse(message.body); // TODO transmit the username
                    $('#messages-list').append('<li>' + bodyObj.owner.username + ' - ' + bodyObj.content + '</li>');
                    console.log("received a message: " + bodyObj.content);
                   
                })

                // Send Messages
                $('#send-message').click(function () {
                    console.log("sending message")
                    ws.send('/app/message.send', {
                        Authorization: "Bearer " + token
                    }, '{"content": "' + $('#message').val() + '"}');

                    
                })

            }, 

             

            function (error) {
                console.error("STOMP error " + error);
            });



       

        }
        function login(){
        	
        
        	$.ajax({

                    url : 'http://localhost:9192/api/v1/auth/login',
                    type : 'POST',
                    data : JSON.stringify({ username: "artashes", password: "12345678" }),
                    dataType:'json',
                    contentType: "application/json;charset=utf-8",
                    success : function(data) {
                    

                    var now = new Date();
                    now.setMinutes(now.getMinutes() + 30);//30=time to leave ttl
                    localStorage.setItem('access-token' , JSON.stringify({
                        accessToken:data.token , 
                        expiry: now
                    }));
                    
                    
                        connect(data.token)
                        
                    },
                    error : function(request,error)
                    {
                        alert("Something went wrong: "+JSON.stringify(request));
                    }
                }); 
    	}

$( document ).ready(function() {
    console.log(localStorage.getItem('access-token'));
    if (localStorage.getItem ('access-token') !== null) {
        const accessTokenObj = JSON.parse(localStorage.getItem('access-token'))
        
            
        
        }

});





