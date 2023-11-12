const express = require('express'),
      app = express(),
      fs = require('fs'),
      path = require('path');
const port = 80,
      songdir = path.join(__dirname, 'songs');
      
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/cluster', express.static(songdir));
app.use('/', express.static(path.join(__dirname, '..', 'frontend')))     /* enables frontend */


app.get('/api/search', (req, res) => {
  const query = req.query.q.toLowerCase().replace(/\s/g, '');
  if (!query || query.length < 2) { return res.status(400).json({ error: "no query/shorther than 2 chars" }) }

  fs.readdir(songdir, (err, files) => {
    if (err) { return res.sendStatus(500) }
    const results = [];

    files.forEach((f) => {
      const fpath = path.join(songdir, f);
      if (fs.statSync(fpath).isDirectory()) {
        const sub = fs.readdirSync(fpath);
        const matching = sub.filter((fi) => { 
          fi = path.parse(fi).name.toLowerCase();
          regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
          return regex.test(fi);
        });
        
        if (matching.length > 0) {
          matching.forEach((fi) => {
            results.push({ cluster: f, name: fi });
          });
        }
      } else {
        var fn = path.parse(f).name.toLowerCase();
        var regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        if (regex.test(fn)) {
          results.push({ cluster: null, name: f });
        }
      }
    });

    res.json(results);
  });
});

app.listen(port, ()=>{
  console.log(`listening on port ${port}`);
});