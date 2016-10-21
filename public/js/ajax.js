
function ajaxGet(method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(JSON.parse(xmlhttp.responseText));
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
   
function ajaxPost(url, postData, callback) {
   var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(JSON.parse(xmlhttp.responseText));
         }
      };
      
      xmlhttp.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.send(data);
}
