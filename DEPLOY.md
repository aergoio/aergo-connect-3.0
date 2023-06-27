# Deploy

## Build dev version for local test

1. In `aergo-connect/packages/@aergo-connect/extension/package.json`, set "version_name" to something like "beta".
2. Run `yarn build-dev`
3. In Chrome, go to Extensions, click "Load unpacked", and navigate to `aergo-connect/packages/@aergo-connect/extension/dist-dev`.
4. You can also send this directory to others for testing.

## Build

1. In `aergo-connect/packages/@aergo-connect/extension/package.json`, set "version" and "version_name" to the desired value.
2. Run `yarn build`
3. Run `cd aergo-connect/packages/@aergo-connect/extension && yarn package`
4. Login to [Chrome Web Store Dashboard](https://chrome.google.com/webstore/developer/dashboard)
5. Go to the Publisher "[Aergo](https://chrome.google.com/webstore/devconsole/dd5af5a9-5aff-4378-993b-18d28620427c)"
6. Open the item "[Aergo Connect](https://chrome.google.com/webstore/devconsole/dd5af5a9-5aff-4378-993b-18d28620427c/iopigoikekfcpcapjlkcdlokheickhpc/edit/package)"
7. Go to "Package" and click "Upload new package"
8. Select the zip archive generated in step 3 (it's at `aergo-connect/packages/@aergo-connect/extension/release/aergo-connect_version.zip`)
9. Check the data and click "Save draft", then "Submit for review".

### Getting access to Chrome Web Store

- You need to be a member of the Google group `aergo-connect@blocko.io` to access the "Aergo" publisher in Chrome Web Store.

### How long does the review take?

- In my experience, review can take anything from 1-4 weeks.

Just submitted Aergo Connect 2.2.0 for review.
I noticed that the item had been taken down from the store just a few days ago due to asking for more permissions than necessary, I fixed that too.
Let’s hope they review and reinstate it quickly.
I documented the process here:
