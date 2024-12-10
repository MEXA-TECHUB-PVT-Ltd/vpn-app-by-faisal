
package com.stealthlinkvpnapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.VpnService;
import android.os.Bundle;
import android.os.RemoteException;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;
import java.net.URLDecoder;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import de.blinkt.openvpn.R;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConfigParser;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.OpenVPNThread;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VPNLaunchHelper;

public class VpnServiceModule extends ReactContextBaseJavaModule {

    private static final String TAG = "VpnServiceModule";
    private static final int VPN_REQUEST_ID = 1;

    private VpnProfile vpnProfile;

    private String config = "";
    private String username = "";
    private String password = "";
    private String name = "";
    private String dns1 = VpnProfile.DEFAULT_DNS1;
    private String dns2 = VpnProfile.DEFAULT_DNS2;

    private ArrayList<String> bypassPackages;

    private boolean attached = true;
    private boolean isVPNRunning = false; // Track the VPN state

    private JSONObject localJson;

    public VpnServiceModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        LocalBroadcastManager.getInstance(reactContext).registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String stage = intent.getStringExtra("state");
                if (stage != null) sendStageToJS(stage);

                try {
                    String duration = intent.getStringExtra("duration");
                    String lastPacketReceive = intent.getStringExtra("lastPacketReceive");
                    String byteIn = intent.getStringExtra("byteIn");
                    String byteOut = intent.getStringExtra("byteOut");

                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("duration", duration);
                    jsonObject.put("last_packet_receive", lastPacketReceive);
                    jsonObject.put("byte_in", byteIn);
                    jsonObject.put("byte_out", byteOut);

                    localJson = jsonObject;

                    WritableMap params = Arguments.createMap();
                    params.putString("duration", duration);
                    params.putString("last_packet_receive", lastPacketReceive);
                    params.putString("byte_in", byteIn);
                    params.putString("byte_out", byteOut);

                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("VpnStatus", params);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new IntentFilter("connectionState"));
    }

    @NonNull
    @Override
    public String getName() {
        return "VpnServiceModule";
    }




    @ReactMethod
    public void startVpn(String config, String country, String username, String password, String dns1, String dns2) {
        this.config = config;
        this.name = country;
        this.username = username;
        this.password = password;
        this.dns1 = dns1 != null ? dns1 : VpnProfile.DEFAULT_DNS1;
        this.dns2 = dns2 != null ? dns2 : VpnProfile.DEFAULT_DNS2;

        if (config == null || name == null) {
            Log.e(TAG, "Config not valid!");
            return;
        }

        prepareVPN();
    }

    @ReactMethod
    public void stopVpn() {
        try {
            if (isVPNRunning) {
                OpenVPNThread.stop();
                sendStageToJS("disconnected");
                isVPNRunning = false; // Update the state
            } else {
                Log.d(TAG, "VPN is not running, no need to stop.");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error stopping VPN: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void refreshStage() {
        sendStageToJS(OpenVPNService.getStatus());
    }

    @ReactMethod
    public void refreshStatus() {
        sendStatusToJS();
    }

    private void prepareVPN() {
        if (isVPNRunning) {
            Log.d(TAG, "VPN is already running, ignoring duplicate start request.");
            return;
        }

     if (isConnected()) {
    sendStageToJS("prepare");

    try {
        ConfigParser configParser = new ConfigParser();
        configParser.parseConfig(new StringReader(config));
        vpnProfile = configParser.convertProfile();
        if (vpnProfile == null) {
            Log.e(TAG, "Failed to create vpnProfile: vpnProfile is null after parsing.");
            return;
        }
    } catch (IOException | ConfigParser.ConfigParseError e) {
        Log.e(TAG, "Failed to parse VPN config: " + e.getMessage());
        e.printStackTrace();
        return;
    }

    Intent vpnIntent = VpnService.prepare(getReactApplicationContext());
    if (vpnIntent != null) {
        getCurrentActivity().startActivityForResult(vpnIntent, VPN_REQUEST_ID);
    } else {
        // If no user interaction is required, start the VPN directly
        startVPN();
    }
} else {
    sendStageToJS("nonetwork");
}

    }




 private void startVPN() {
    try {
        sendStageToJS("connecting");

        if (vpnProfile.checkProfile(getReactApplicationContext()) != de.blinkt.openvpn.R.string.no_error_found) {
            throw new RemoteException(getReactApplicationContext().getString(vpnProfile.checkProfile(getReactApplicationContext())));
        }

        vpnProfile.mName = name;
        vpnProfile.mProfileCreator = getReactApplicationContext().getPackageName();
        vpnProfile.mUsername = username;
        vpnProfile.mPassword = password;
        // vpnProfile.mDNS1 = dns1;
        // vpnProfile.mDNS2 = dns2;
        vpnProfile.mDNS1 = dns1 != null ? dns1 : VpnProfile.DEFAULT_DNS1;
vpnProfile.mDNS2 = dns2 != null ? dns2 : VpnProfile.DEFAULT_DNS2;

if (vpnProfile.mDNS1 != null && vpnProfile.mDNS2 != null) {
    vpnProfile.mOverrideDNS = true;
}

        if (dns1 != null && dns2 != null) {
            vpnProfile.mOverrideDNS = true;
        }

        // Optionally, set allowed apps and bypass packages
        // if (bypassPackages != null && !bypassPackages.isEmpty()) {
        //     vpnProfile.mAllowedAppsVpn.addAll(bypassPackages);
        //     vpnProfile.mAllowAppVpnBypass = true;
        // }

        ProfileManager.setTemporaryProfile(getReactApplicationContext(), vpnProfile);
        VPNLaunchHelper.startOpenVpn(vpnProfile, getReactApplicationContext());

        sendStageToJS("connected");
         isVPNRunning = true;
    } catch (RemoteException e) {
        sendStageToJS("disconnected");
        e.printStackTrace();
    }
}


    private boolean isConnected() {
        ConnectivityManager cm = (ConnectivityManager) getReactApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo nInfo = cm.getActiveNetworkInfo();
        return nInfo != null && nInfo.isConnectedOrConnecting();
    }

    private void sendStageToJS(String stage) {
        WritableMap params = Arguments.createMap();
        params.putString("stage", stage);
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("VpnStage", params);
    }

    private void sendStatusToJS() {
        if (localJson != null && attached) {
            WritableMap params = Arguments.createMap();
            params.putString("duration", localJson.optString("duration"));
            params.putString("last_packet_receive", localJson.optString("last_packet_receive"));
            params.putString("byte_in", localJson.optString("byte_in"));
            params.putString("byte_out", localJson.optString("byte_out"));

            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("VpnStatus", params);
        }
    }
}


// package com.stealthlinkvpnapp;

// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;

// public class VpnServiceModule extends ReactContextBaseJavaModule {

//     public VpnServiceModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//     }

//     @Override
//     public String getName() {
//         return "VpnServiceModule";
//     }

//     @ReactMethod
//     public void connectToVpn(String config, Promise promise) {
//         try {
//             // Use your vpnLib methods here to establish a connection
//             // Example: VpnManager.connect(config);
//             promise.resolve("VPN Connected Successfully");
//         } catch (Exception e) {
//             promise.reject("VPN_CONNECTION_ERROR", e);
//         }
//     }
// }

