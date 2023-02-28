# Set Up

## Configure Kenku FM

1. Change the IP address in your Kenku Remote Configuration to 0.0.0.0. This will make it visible to other computers on your local network.
1. If you are running Kenku FM on the same computer that you'll be running this webserver on, make sure you aren't using port `3000` for Kenku Remote.
1. This is the more difficult step: Kenku FM will block requests from this webapp unless you modify Kenknu's CORS configuration, which is not exposed through the app. This means you'll need to pull down their code, then make a change and build a new version of the app and use that one instead of the official version. You can see a feature request with an example of the change you'll need to make [here](https://github.com/owlbear-rodeo/kenku-fm/issues/62).
