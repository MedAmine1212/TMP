

//======================== recuperation des msg pour un canal privé ==================================
  
function getuser_message(rc) {
  //console.log("houni");

   document.getElementById('rc').value = rc;
   sd = $('[name=currentS]').val();
   //console.log(rc);
   //console.log(sd);
  
   $('#ecriremsg').html('');
   $('#userconnected').html('');
   var element = document.getElementById("ecriremsg");
     
   $.ajax({
    type: "GET",
    url: api_gateway_url + "/factories-service/factories/getmessages/"+sd+"/"+rc,
    success: function(data) {
  
      //traitement du receiver connecté
      if (data[data.length-1].photo == '' || data[data.length-1].photo == 'N/A' || data[data.length-1].photo == 'null' || data[data.length-1].photo == null || data[data.length-1].photo == undefined) 
      {
        $('#userconnected').append('<img class="message-avatar rounded-circle" src="/img/0.jpg"  />');   
       
      }
      else{
      $('#userconnected').append('<img class="message-avatar rounded-circle" '+'src='+assetsURL + 'faceMember/'+data[data.length-1].photo +' />');}

      $('#userconnected').append('<small class="float-right text-muted" >'+data[data.length-1].firstName+" "+data[data.length-1].lastName+'</small>');   
     
      //// fin traitement du receiver connecté

      //traitement des msg envoyés
        for (var a = 0; a <= data.length - 2 ; a++)
       {if((data[a].sender==sd && data[a].receiver==rc) || (data[a].receiver==sd && data[a].sender==rc))
     
 {        element.classList.add('chat-message', 'left');
   
      if (data[a].photo == '' || data[a].photo == 'N/A' || data[a].photo == 'null' || data[a].photo == null || data[a].photo == undefined) 
      {
        $('#ecriremsg').append('<img class="message-avatar rounded-circle" src="/img/0.jpg"  />');   
       
      }
      else{
          
        $('#ecriremsg').append('<img class="message-avatar rounded-circle" '+'src='+assetsURL + 'faceMember/'+data[a].photo +' />');
      }
        $('#ecriremsg').append("<div class"+"="+"message"+"><a class"+"="+"message-author"+"href="+"#"+">"+ data[a].firstName+" "+data[a].lastName+"</a><span class"+"="+"message-date"+">"+  data[a].sendTime+"</span><span class"+"="+"message-content"+">"+data[a].content+"</span></div+"+">");
   
    }
       }
       //fin traitement des msg envoyés
    },
    error: function(req, status, error) {
        console.log(req);
    },
});
                              
}






//======================== envoyer le msg privé pour un sender et un receiver ==================================
   function sendMessage(message) {
     message = $("#messages_input").val();
     rc = $('[name=currentR]').val();
     sd = $('[name=currentS]').val();
    

    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader(
                "Authorization",
                "Bearer " + readCookie("_token")
            );
        },
    });


if(message!="")
    $.ajax({
        type: "POST",
        url: api_gateway_url+"/factories-service/factories/send-message",
        
        data: {sender: sd, receiver: rc ,message: message },
      
        success: function (response) {
           console.log("ok");

        },
        error: function (req, status, err) {
            console.log("errr");
        },
    });

}

   //======================== traitement de l'evenement pour assurer la synchronisation  ==================================
   Pusher.logToConsole = true;

  var pusher = new Pusher('bd323a15ca66be20beab', {
    cluster: 'eu'
  });

  var channel = pusher.subscribe('my-channel');
  channel.bind('send-event', function(data) {
    rc = $('[name=currentR]').val();
    sd = $('[name=currentS]').val();
   
    if((data["msg"]["sender"]==sd && data["msg"]["receiver"]==rc) || (data["msg"]["receiver"]==sd && data["msg"]["sender"]==rc))
    {
   
    var element = document.getElementById("ecriremsg");
    element.classList.add('chat-message', 'left');
  
  if (data["msg"]["photo"] == '' || data["msg"]["photo"] == 'N/A' || data["msg"]["photo"] == 'null' || data["msg"]["photo"] == null || data["msg"]["photo"] == undefined) 
      
  {
    $('#ecriremsg').append('<img class="message-avatar rounded-circle" src="/img/0.jpg"  />');   
 
  }
  else {
    $('#ecriremsg').append('<img class="message-avatar rounded-circle" '+'src='+assetsURL + 'faceMember/'+data["msg"]["photo"]+' />');}
    $('#ecriremsg').append("<div class"+"="+"message"+"><a class"+"="+"message-author"+"href="+"#"+">"+data["msg"]["firstName"]+" "+data["msg"]["lastName"]+"</a><span class"+"="+"message-date"+">"+ data["msg"]["sendTime"]+"</span><span class"+"="+"message-content"+">"+data["text"]+"</span></div+"+">");
   
  }
  
}
  );