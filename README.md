# MrClippy

A simple, experimental app for storing, editing and loading clipboard content.

The app is under heavy development to define its initial shape. At this point I don't care that much for UI until all the essential features are in place.

Initially the app was developed on Windows. Now it has a basic support on [Mac](https://github.com/mlewand/mrclippy/issues/21) and [Linux](https://github.com/mlewand/mrclippy/issues/20), but I'd like to have a full (see [#53](https://github.com/mlewand/mrclippy/issues/53) for more details, contributors are welcome).

Contributions are welcome.

## Dev Requirements

* nodejs

## Windows

* `npm install --global --production windows-build-tools` - run as Administrator

### Linux

Below requirements are based on Ubuntu 17:

* `sudo apt install make`
* `sudo apt-get install libgconf-2-4` - [required by Electron](https://github.com/electron/electron/issues/1518)

## Running the app

Currently the only way to run it is to use dev version.

```
git clone https://github.com/mlewand/mrclippy.git mrclippy
cd mrclippy
npm install
npm run start
```

## License

MIT © [Marek Lewandowski](https://github.com/mlewand/mrclippy)
