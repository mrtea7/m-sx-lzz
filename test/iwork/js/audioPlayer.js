var audioPlayer = (function(){

    var audioController = function(){
        this.task_audio = new Audio();
    }
    audioController.prototype = {
        playSound: function(thi, evt, callback){
            evt.preventDefault();
            var that = this;
            var sound_url = "";
            console.log(callback);
            if(thi.getAttribute("data-status") == "stopped"){
                sound_url = thi.getAttribute("data-sound");
                setTaskSoundHandler(thi, sound_url, callback);
            }
            else if(thi.getAttribute("data-status") == "playing"){
                that.task_audio.pause();
                thi.setAttribute("data-status", "stopped");
                callback.call(this);
            }


            function setTaskSoundHandler(thi, url, callback){
                var taskAudioEnd = function(){
                    thi.setAttribute("data-status", "stopped");
                    callback.call(this);
                };

                if(that.task_audio.src == ""){
                    that.task_audio.setAttribute("src", url);
                    that.task_audio.addEventListener("ended", taskAudioEnd, false);
                }
                that.task_audio.play();
                thi.setAttribute("data-status", "playing");
                callback.call(this);
            }
        }
    }
    return new audioController();
})();