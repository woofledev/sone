(()=>{
  const server = location.origin;  // server location
  const util = {
    $: s => document.querySelector(s),
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
          cb(JSON.parse(xhr.responseText), false);
        } else if (xhr.responseText !== '') {  // error
          cb(JSON.parse(xhr.responseText), true);
        }
      };
      xhr.send();
    }
  }


  
  var search = util.$('.sr'), container = util.$('.container');
  function searchHandler() {
    util.xhr("GET", `${server}/api/search?q=${search.value}`, (xhr, err) => {
      container.innerHTML = '';
      if (err) { return container.innerHTML = `<b>error: ${xhr.error}</b>` };

      xhr.forEach((data) => {
        // parsing the metadata
        var name = data.name.match(/^(.+?)(?: - (.+?))?(?: - (.+))(\.\w+)$/) || [data.name];
        let meta = name[2] ? `${name[2]} Â· ${name[1]}` : name[1] || name[0]; // if album is undefined, use artist/filename.
  

        const entry = document.createElement('div'), 
              title = document.createElement('b');
        title.appendChild(document.createTextNode(name[3] || name[0]));
        
        entry.appendChild(title);
        entry.appendChild(document.createElement('br'));
        entry.appendChild(document.createTextNode(meta));
        entry.classList.add('entry');

        
        entry.onclick = () => {
          const uri = data.cluster === null ? `${server}/cluster/${data.name}` : `${server}/cluster/${data.cluster}/${data.name}`
          const audio = util.$('#audio');
          audio.src = uri;
          audio.controls = true;
          audio.play();
          document.title = `sone | ${name[1]||'???'} - ${name[3]||name[0]}`;  // artist - title
        };
        container.appendChild(entry);
        container.appendChild(document.createElement('hr'));
      });
    });
  }  
  search.addEventListener('input', util.debounce(searchHandler, 300));
})();