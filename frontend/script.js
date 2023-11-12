var qs=function(r){var e=document.querySelector(r);return{_:e,len:e.length,on:function(n,t,i){e.addEventListener(n,t,i)},off:function(n,t,i){e.removeEventListener(n,t,i)},text:function(n){if(n===void 0)return e.innerText;e.innerText=n},html:function(n){if(n===void 0)return e.innerHTML;e.innerHTML=n},css:function(n,t){if(t===void 0)return window.getComputedStyle(e)[n];e.style[n]=t},first:e.firstChild,class:e.classList,attr:function(n,t){if(t===void 0)return e.getAttribute(n);e.setAttribute(n,t)},append:function(n){return e.appendChild(n)},prepend:function(n){return e.insertBefore(n,this.first)},remove:function(){return e.parentNode.removeChild(e)},show:function(){this.css("display","")},hide:function(){this.css("display","none")}}};

(()=>{
  const server = location.origin;  // server location
  const util = {
    debounce: function(cb, delay) {
      let timer;
      return function() {
        clearTimeout(timer);
        timer = setTimeout(cb, delay);   
      }
    },
    xhr: function(method, url, cb) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          cb(JSON.parse(xhr.responseText));
        }
      };
      xhr.send();
    }
  }


  
  var search = qs('.search'), container = qs('.container');
  function handler() {
    container.html('');
    util.xhr("GET", `${server}/api/search?q=${search._.value}`, (xhr) => {
      xhr.forEach((data) => {
        // parsing the metadata
        var name = data.name.match(/^(.+?)(?: - (.+?))?(?: - (.+))(\.\w+)$/);
        let meta = name[2] === undefined ? `${name[1]}` : `${name[2]} · ${name[1]}`; // if album is undefined, use artist instead.
  

        const entry = document.createElement('div'), 
              title = document.createElement('b');
        title.appendChild(document.createTextNode(name[3]));
        
        entry.appendChild(title);
        entry.appendChild(document.createElement('br'));
        entry.appendChild(document.createTextNode(meta));
        entry.classList.add('entry');

        
        entry.onclick = () => {
          const uri = data.cluster === null ? `${server}/cluster/${data.name}` : `${server}/cluster/${data.cluster}/${data.name}`
          const audio = qs('#audio');
          audio._.src = uri;
          audio._.controls = true;
          audio._.play();
          document.title = `sone | ${name[1]} - ${name[3]}`;  // artist - title
        };
        container.append(entry);
        container.append(document.createElement('hr'));
      });
    });
  }  
  search.on('input', util.debounce(handler, 300));
})();