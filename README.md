# @bagbyte/capacitor-branchio
This is Branch.io plugin for Capacitor.

## Installation

### Step 1: NPM Install
```bash
$ npm install @bagbyte/capacitor-branchio
```

### Step 2: Plugin configuration and initialization
The following configuration assumes that your application supports:
1. universal links with the domain `EXAMPLE.com`
2. Branch app links with the domain `EXAMPLE.app.link`
3. custom schema `EXAMPLESCHEMA://`

#### Android
To configure your Android app, the `AndroidManifest.xml` needs some changes (as per this [link](https://docs.branch.io/apps/android/#configure-app)). The same steps have been summarized in the following 5 steps:

1. Add `android:launchMode="singleTask"` in your `<activity>` tag
2. Inside your `<activity>` tag add the following `intent-filter` in order to support Branch URI schema 
```xml
<intent-filter>
    <data android:scheme="EXAMPLESCHEMA" />
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
</intent-filter>
```
3. (Optional) Insode your `<activity>` tag add the following `intent-filter` in order to support Branch App Links 
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
4. After `<activity>` tag, add the following `meta-data` with your Branch keys
```xml
  <meta-data android:name="io.branch.sdk.BranchKey" android:value="key_live_kaFuWw8WvY7yn1d9yYiP8gokwqjV0Sw" />
  <meta-data android:name="io.branch.sdk.BranchKey.test" android:value="key_test_hlxrWC5Zx16DkYmWu4AHiimdqugRYMr" />
```
5. (Optional) Add the following lines for Branch install referrer tracking
```xml
<receiver android:name="io.branch.referral.InstallListener" android:exported="true">
    <intent-filter>
        <action android:name="com.android.vending.INSTALL_REFERRER" />
    </intent-filter>
</receiver>
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

#### Capacitor plugin configuration
In your `capacitor.config.json` file, you can use the following configuration:

```json
  "plugins": {
    [...]
    "BranchIO": {
      "test": true,
      "tracking_disabled": false,
      "verbose": true
    }
  }
```

1. `test`can be used to set the test mode on
2. `tracking_disabled` can be used to set the initial status of the tracking
3. `verbose` is used to set the logging on

## Methods

### disableTracking(_options_: { _value_: _boolean_ }): Promise<boolean>
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

### creditHistory(): Promise<any>
Load credit history.

```js
Plugins.CapacitorFirebaseAnalytics.appInstanceId();
```

### resetAnalyticsData()
Clears all analytics data for this instance from the device and resets the app instance ID.

```js
FirebaseAnalytics.resetAnalyticsData();
```

***


# Reference [Android]
## Step 1: Firebase App Setup
1. On the Firebase console (https://console.firebase.google.com/), click "Add project."
2. Click "Create Project" after naming the project and accepting the terms.
3. Click the continue button after the project is ready.
4. Click on the Android logo to add an app. If you are unable to find it, follow these steps:
    * In the top left, there is a cog next to "Project Overview." Click it and go to the project settings.
    * At the bottom of the general settings, click on the Android logo in the "Your apps" section to add an app.
5. Enter a package name. Keep your browser open. You will finish this later.

## Step 2: Create new project
1. `ionic start <name> <template> [options]` See: https://ionicframework.com/docs/cli/commands/start/
2. `cd [project-directory]`
3. `npm install`
4. `ionic build`
5. `npm install --save @capacitor/core @capacitor/cli` See: https://capacitor.ionicframework.com/docs/getting-started/
6. `npx cap init`
7. When you are prompted for the "App Package ID", enter in the package that was entered on Step 5 of Step 1.
8. `npx cap add android`

## Step 3: Install Plugin
1. `npm install capacitor-firebase-analytics`
2. `npx cap sync`
3. Open project in Android Studio.
4. In the 'MainAcivity.java' file, add `add(com.philmerrell.firebaseanalytics.CapacitorFirebaseAnalytics.class);` in the `this.init` method call.
 
## Step 4: Add dependencies
1. Return to the Firebase app registration from the end of Step 1.
2. Click "Register app"
3. Follow the instructions for downloading the 'google-services.json' and adding the Firebase SDK.
4. Run the app. If everything worked correctly, you should see a response on the Firebase console.
5. More info can be found here: https://firebase.google.com/docs/android/setup
