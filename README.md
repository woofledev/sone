# sone
simple, minimalist music streaming.<br>
<img src="https://i.postimg.cc/1tqJVB6T/image.png" alt="screenshot" width="300" />

## installation
```sh
git clone https://github.com/woofledev/sone && cd sone/backend
npm install
npm start

# you might also want to remove .gitkeep from the songs directory
rm -f songs/.gitkeep
```

### adding songs
you can add songs by placing them inside the `backend/songs` directory.<br>
you can also organize them into 'clusters' (folders), however avoid nesting them.<br>

make sure your files follow this naming convention, or else they won't show up in the frontend (correctly): **`artist - album - title.mp3`**<br>

some examples:
- `songs/Frank Ocean/Frank Ocean - Novacane.mp3`
- `songs/Katy Perry - Teenage Dream - California Girls.mp3`
