var texttodisplay = document.getElementById('me');
function restore(){
  Fr.voice.stop();
}

 function makeWaveform(){
  var analyser = Fr.voice.recorder.analyser;

  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  
  Fr.voice.export(function(url){
    $("<audio src='"+ url +"'></audio>").appendTo("body");
    $("body audio:last")[0].play();
  }, "URL");
}

$(document).ready(function(){
  $("#record").on("mousedown",function(){
    console.log("ASR REC START");
    //setLoder();
    $("#record").addClass("base64");
    Fr.voice.record($("#live").is(":checked"), function(){
      makeWaveform();
    });
  });

  $("#record").on("click", function(){
    Fr.voice.stopRecordingAfter(5000, function(){
      //alert("Recording stopped after 5 seconds");
    });
  });


  $("#record").on("touchend", function () {
      console.log("touchend");
      console.log("ASR START");
      resetLoader();

      var language = 0;
      console.log(" language : " + language);
      if (language == 0) {
          Fr.voice.export(function (blob) {
              console.log(blob);
              getEngText(blob);
          }, "blob");
      } 
      restore();
  });



$("#record").on("mouseup",function () {
    //console.log("ASR START");
    //resetLoader();
  
  var language = 0;
  console.log(" language : "+language);
  if(language == 0){
    Fr.voice.export(function(blob){
      console.log(blob);
      getEngText(blob);
    }, "blob");
  }
    restore();
  });
});

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

var countArray = ["0"];
var y = 1;
function getEngText(blob) { 
console.log("ENG");
$("#loader").css("display", "block");
$('.asr-btn-record').prop('disabled',true);

var start_time = new Date().getTime();
var lastItem = countArray.pop();
var x = parseInt(lastItem);
  
  var language = 0;
  if(language==0){
      var formData = new FormData();
      formData.append('filePath', blob),
      formData.append('samplerate', 16000),
      formData.append('channel', 1);

      for (var pair of formData.entries()) {
        console.log("formData Console : " + pair[0]+ ': ' + pair[1]);
      }
    
      $.ajax({
      url: "https://apis.sentient.io/microservices/utility/audioprocessing/v0.1/getresults",
      method: 'POST',
      headers:{'x-api-key':"BFD166A991A24006B34C"},
      data: formData,
      contentType: false,
      processData: false,
      success: function(res) {
        $.ajax({
                    url: "https://apis.sentient.io/microservices/voice/asr/v0.1/getpredictions",
          method: 'POST',
          headers:{'x-api-key':apiKey},
          contentType: 'application/json',
          data: JSON.stringify({"model" : "news_parliament", "wav_base64" : res.results.AudioContent, "file_type" : "wav", "vad_threshold": 0.4}),
          processData: false,
          success: function(resp) {
                        console.log("resp : " + JSON.stringify(resp));
            for (var index in resp) {
                            console.log(resp[index]);
              var count = parseInt(x + y);
              countArray.push(count);
              console.log("ajaxCounter" + countArray);
                            var request_time = new Date().getTime() - start_time;
                            texttodisplay=""
                            if (resp.results) {
                                var i;
                                for (i = 0; i < resp.results.length; i++) {
                                  document.getElementById("snackbar").innerHTML = resp.results[i].text;
                                  texttodisplay = morse(resp.results[i].text);
                                  activate();
                                }   
                            }
                            $('#voice_ouputs').append("<div class='outputcontainerblue'><span class='count'>" + countArray + "</span><p>" + texttodisplay +"</p><span class='time-right'>"+request_time+" ms</span></div>");
              $('#voice_ouputs').scrollTop(25000);
              $("#loader").css("display", "none");
              //$('.asr-btn-record').prop('disabled',false);
            }
          },
          error:function(err){
            var count = parseInt(x + y);
              countArray.push(count);
              console.log("ajaxCounter" + countArray);
            var request_time = new Date().getTime() - start_time;
            $('#voice_ouputs').append("<div class='outputcontainerblue'><span class='count'>"+countArray+"</span><p>"+err.text+"</p><span class='time-right'>"+request_time+" ms</span></div>");
            //$("#disableDiv").css("display", "none");
            //$("#recordDiv").css('display','block'); 
            $("#loader").css("display", "none");      
            //$('.asr-btn-record').prop('disabled',false);

          } 
          });
      }
      });
  }
}



function clearAll() {
  $("#disableDiv").css("display", "none");
}

function setLoder() {
  $("#record").removeClass("base64");
  $('.asr-btn-record').css('display','none');
  $('.asr-btn-disable').css('display','flex');
}

function resetLoader(){
 $('.asr-btn-record').css('display','flex');
 $('.asr-btn-disable').css('display','none');
}
