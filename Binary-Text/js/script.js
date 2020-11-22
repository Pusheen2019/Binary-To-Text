"use strict"
   $(document).ready( function() {
      $("#charsel").on("change", function() { OnEncodingChange(); });
      $("#del").on("change", function() { OnDelChange() });
      $("#bin").on("dragover", function(event) {
         event.preventDefault();  
         event.stopPropagation();
         $(this).addClass('draghover');
         return false;  
      });
      $("#bin").on("dragleave dragend", function(event) {
         event.preventDefault();  
         event.stopPropagation();
         $(this).removeClass('draghover');
         return false;  
      });
      $("#bin").on("drop", function(event) {
         event.preventDefault();  
         //event.stopPropagation();
         $(this).removeClass('draghover');
         var file = event.originalEvent.dataTransfer.files[0]
         document.getElementById("fileElem").value="";
         fileLoad(file);
      });
   });
   function OnOpen()
   {
      $("#fileElem").click();
   }
   function OnOpenBin()
   {
      $("#binFileElem").click();
   }
   function OnViewSelection()
   {
      var iencode = document.getElementById("charsel").selectedIndex;
      if( iencode>0 ) return;
      var start=document.getElementById("bin").selectionStart;
      var end=document.getElementById("bin").selectionEnd;
      if( end-start==0 ) return;
      OnConvert();
      var bin=document.getElementById("bin").value;
      var binlen=bin.match(/[0-1]/g).join('').length;
      var dellen=Math.round((bin.length-binlen)/(binlen/8-1));
      var len=8+dellen;
      document.getElementById("txt").focus();
      document.getElementById("txt").selectionStart = start/len;
      document.getElementById("txt").selectionEnd = (end+dellen)/len;
   }
   function OnEncodingChange()
   {
      var iencode = document.getElementById("charsel").selectedIndex;
      if( iencode<1 )
         document.getElementById("viewsel").disabled = false;
      else
         document.getElementById("viewsel").disabled = true;
   }
   function OnFile()
   {
      var file = document.getElementById("fileElem").files[0];
      fileLoad(file);
   }
   function OnBinFile()
   {
      var file = document.getElementById("binFileElem").files[0];
      binFileLoad(file);
   }
   function OnSave()
   {
      //var file=$("#file").val();
      //if( file=="" ) file="file.txt";
      fileSave("text-output.txt");
   }
   function fileLoad(file)
   {
      var reader = new FileReader();
      reader.onloadend=function(e) {
         if( e.target.readyState==FileReader.DONE ) {
            var txt = e.target.result;
            $("#bin").val(txt);
            $("#bin").focus();
         }
      };
      reader.readAsText(file, "UTF-8");
   }
   function binFileLoad(file)
   {
      var reader = new FileReader();
      reader.onloadend=function(e) {
         if( e.target.readyState==FileReader.DONE ) {
            //var txt = e.target.result;
            var bin=reader.result;
            var bytes = new Uint8Array(bin);
            var txt="";
            for(var i=0; i<bytes.length; i++)
            {
               var b=bytes[i].toString(2);
               txt+="0".repeat(8-b.length)+b+" ";
            }
            $("#bin").val(txt.trim());
            $("#bin").focus();
         }
      };
      reader.readAsArrayBuffer(file);
   }
   function fileSave(filename)
   {
      var txt=$("#txt").val();
      if( txt=="" ) return;
      var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
   }
   function OnConvert()
   {
      var bin = $("#bin").val();
      //var i=$(".calc select")[0].selectedIndex;
      //if( i==0 )
      var iencode = document.getElementById("charsel").selectedIndex;
      if( iencode==0 )
      {
         bin = bin.replace(/[^0-1]/g,"");
         bin = bin.match(/[0-1]{8}/g);
      }
      else
         bin = bin.match(/[0-1]*/g).filter(function (el) {
            return el!="";
         });
      var len = bin.length;
      if( len==0 ) return;
      var txt='';
      if( iencode<2 )
      {
         for(var i=0; i<len; i++)
         {
            var b = bin[i];
            var code = parseInt(b,2);
            var t = String.fromCodePoint(code);
            /*
            var t;
            if( iencode==0 )
               t = String.fromCharCode(code);
            else
               t = String.fromCodePoint(code);
            */
            txt += t;
         }
      }
      else
      {
         var encoding = document.getElementById("charsel").value;
         bin = bin.map(function(item) {
            return parseInt(item, 2);
         });
         var bytes = new Uint8Array(bin);
         txt = new TextDecoder(encoding, { NONSTANDARD_allowLegacyEncoding: true }).decode(bytes);
      }
      document.calcform.txt.value = txt;
   }
   function OnSelect()
   {
      document.calcform.txt.select();
   }
   function OnCopy()
   {
      $("#txt").select();
      document.execCommand("copy");
   }