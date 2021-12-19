<div align="center">
    <img src="https://github.com/bitsai-org/bitsai/blob/master/media/owl-bitsai.png?raw=true" alt="bitsai-owl-logo">
</div>

# BitSai
A cross-platform, modern, and open-source Bitcoin wallet for the masses.

## Getting Started
### Prerequisites
For building and running the frontend server:
- Node - v17.2.0
- Yarn - v1.22.0
> Lower versions might work but they were not tested.

For running the bitcoin regtest network (you only need these for development purposes)
- Docker - [see how to configure docker for your system](https://docs.docker.com/get-docker/)
- [Nigiri](https://github.com/vulpemventures/nigiri)

### Getting the dependencies
1. Install
[Node](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/getting-started/install).


2. Clone this repository and install the dependencies
```bash
git clone https://github.com/bitasai-org/bitsai
cd bitsai
yarn install
```


3. [Install docker](https://docs.docker.com/get-docker/)


4. Install nigiri
```bash
curl https://getnigiri.vulpem.com | bash
```

## Running it
BitSai is hosted on two different instances using [Netlify](https://www.netlify.com/).
- A testnet instance on: [testnet.bitsai.co](https://testnet.bitsai.co)
- A mainnet instance on: [app.bitsai.co](https://app.bitsai.co)
> Beware: the app is still in heavy development so do not put great amounts of btc in the mainnet instance

The two instances each have their respective branch on this git repository and
they are both linked to their respective Netlify instance.
Meaning that each commit on the mainnet branch will trigger a build script in Netlify
that will deploy the new changes to [app.bitsai.co](https://app.bitsai.co).
This is done in the same manner on the testnet branch but the changes will be
deployed to [testnet.bitsai.co](https://testnet.bitsai.co).

Despite the app being available on the internet, you can host it locally and run it
on your browser of choice.

### Development
To start developing on BitSai you need two things:
1. Start the local react front-end server
```bash
yarn start
```
2. Start a local bitcoin regtest network using nigiri
```bash
nigiri start
```

You are all set now!<br>
You can start developing using your local regtest network.

### Build it
To build BitSai app you have to choose which network you want to use, and then
you can `git checkout` to the respective branch and build from there.
For example to build the app on:
- mainnet:
```bash
git checkout mainnet
yarn build
```
- testnet
```bash
git checkout testnet
yarn build
```
- regtest (your local restest network)
```bash
git checkout master
yarn build
```

All the static files will be located in `/public` folder and now you can serve
them locally using any server of your choice. for example using:
- Python
```bash
python -m http.server --directory public 8000
```
- or Ruby
```bash
ruby -run -ehttpd public -p8000
```
You are now set! You can access your locally hosted app in `http://localhost:8000`

## Support BitSai
### Contributing
BitSai is still in the early development stages (alpha) so every little
contribution will help :)<br>
Everyone is encouraged to read the source code and file new issues or pull
requests when encountered with bugs or problems.<br>
As you can see there are still no tests set up, so the main focus now is getting
some unit tests and CI set up.
### Donating
Every donation is appreciated :)<br>
#### __You can buy me a cup of coffee here__
[<img src="https://github.com/bitsai-org/bitsai/blob/master/media/buy-me-a-coffee.png?raw=true" width="200" />](https://www.buymeacoffee.com/Adoliin)


#### __Send crypto to one of these addresses__
<img src="https://raw.githubusercontent.com/bitsai-org/bitsai/03c0f2c0129d3de2b55470db4663c077483de881/media/bitcoin.svg" height="30" /> __BTC__<br>
`bc1qm85ryq8wyjsf8trrstr4swmg34w2xzl4dkpek5`

<img src="https://raw.githubusercontent.com/bitsai-org/bitsai/03c0f2c0129d3de2b55470db4663c077483de881/media/bitcoincash.svg" height="30" /> __BCH__<br>
`bitcoincash:qqvyzdx5c3lzcet87c56ugtum2utsngjluejj95wpq`

<img src="https://raw.githubusercontent.com/bitsai-org/bitsai/03c0f2c0129d3de2b55470db4663c077483de881/media/monero.svg" height="30" /> __XMR__<br>
`88sRZmmeYwNDM9mzBMMnrk6iDWknc1XgpiCpwAEhfT56FkFJLxzWfNw3VwXKZvVuANUMdPjTRNY149gQvWAKmsNg99TEsTH`

## Code of Conduct
Check [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License
This project is licensed under the MIT License - see the
[LICENSE.md](LICENSE.md) file for details.
