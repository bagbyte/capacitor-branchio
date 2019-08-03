# @bagbyte/capacitor-branchio
This is Branch.io plugin for Capacitor. This plugin supports `web`, `iOS` and `Android`.

## Installation

### Step 1: NPM Install
```bash
$ npm install @bagbyte/capacitor-branchio
```

### Step 2: Configure the plugin
In your `capacitor.config.json` file, you can use the following configuration:

```json
{
  [...]
  "plugins": {
    [...]
    "BranchIO": {
      "test": true,
      "tracking_disabled": false,
      "verbose": true,
      "track_referral": false,
      "keys": {
        "live": "key_live_pjSAy0EGED62uHhGUr9GfigcxyaWk5kM",
        "test": "key_test_kbHvA7sJFB3YvNgHNtXzYmpowrj6k8fq"
      }
    }
  }
}
```

1. `test`can be used to set the test mode on
2. `tracking_disabled` can be used to set the initial status of the tracking
3. `verbose` is used to set the logging on
4. `track_referral` is used to enable Branch install referrer tracking
5. `keys` contains the live and test keys, both must be provided, the one in use will be determined by the value of the `test` variable

### Step 3: Platform configuration
The following configuration assumes that your application supports:
1. Universal links with the domain `EXAMPLE.com`
2. Branch app links with the domain `EXAMPLE.app.link`
3. Custom schema `EXAMPLESCHEMA://`

#### Android
To configure your Android app, the `AndroidManifest.xml` needs some changes (as per this [link](https://docs.branch.io/apps/android/#configure-app)). The same steps have been summarized in the following 5 steps:

1. Inside your `<activity>` tag add the following `intent-filter` in order to support Branch URI schema 
```xml
<intent-filter>
    <data android:scheme="EXAMPLESCHEMA" />
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
</intent-filter>
```
2. (Optional) Insode your `<activity>` tag add the following `intent-filter` in order to support Branch App Links 
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="EXAMPLE.app.link" />
    <data android:scheme="https" android:host="EXAMPLE-alternate.app.link" />
    <data android:scheme="https" android:host="EXAMPLE.test-app.link" />
    <data android:scheme="https" android:host="EXAMPLE-alternate.test-app.link" />
</intent-filter>
```

To load the plugin, in the file `android/app/src/main/java/**/**/MainActivity.java`, add the plugin to the initialization list:

```java
this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
  [...]
  add(com.bagbyte.capacitor.plugins.BranchIO.class);
  [...]
}});
```

#### iOS
In the `Info.plist` file, add the following keys.

```xml
<key>branch_app_domain</key>
<string>EXAMPLE.app.link</string>
<key>branch_key</key>
<dict>
    <key>live</key>
    <string>key_live_pjSAy0EGED62uHhGUr9GfigcxyaWk5kM</string>
    <key>test</key>
    <string>key_test_kbHvA7sJFB3YvNgHNtXzYmpowrj6k8fq</string>
</dict>
<key>branch_universal_link_domains</key>
<array>
    <string>EXAMPLE.com</string>
</array>
```

## Methods

### disableTracking(_options_: { _value_: _boolean_ }): void
It is used to disable or enable the tracking (based on customer's preference).

```js
Plugins.BranchPlugin.disableTracking({ value: true });
```

### setIdentity(_options_: { _id_: _string_ }): Promise<void>
Sets the user ID property.

```js
Plugins.BranchPlugin.setIdentity({ id: '11223344' });
```

### logout(): Promise<void>
Logout the current user.

```js
Plugins.BranchPlugin.logout();
```

### redeemRewards(options: { amount: number, bucket?: string }): Promise<any>
Redeem credits.

```js
Plugins.BranchPlugin.redeemRewards({ amount: 500, bucket: 'signup' });
```

### creditHistory(options: { options?: CreditHistoryOptions }): Promise<any>
Load credit history.

```js
Plugins.BranchPlugin.creditHistory({ lenght: 100, bucket: 'signup' });
```

### logEvent(options: { name: EventName, data?: EventData, content_items?: ContentItem[] }): Promise<void>
Log an event.

```js
Plugins.BranchPlugin.logEvent({ name: 'my_event' });
```

### trackPageView(options: { data?: EventData, content_items?: ContentItem[] }): Promise<void>
Track a page view, it sends the standard event `VIEW_ITEM`.

```js
let contentItems = {
  $canonical_identifier: 'Login',
  $canonical_url: '/login',
};

Plugins.BranchPlugin.trackPageView({ content_items: [contentItems] });
```
