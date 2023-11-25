package org.musictheoryteacher;

import android.util.Log;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.json.JSONObject;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;
import org.vosk.android.StorageService;
import java.io.IOException;
import org.json.JSONObject;

public class SpeechRecognizerModule extends ReactContextBaseJavaModule {
  final ReactApplicationContext context;
  private Model model = null;
  private SpeechService speechService = null;
  private Recognizer recognizer = null;

  SpeechRecognizerModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }

  @Override
  public String getName() {
    return "SpeechRecognizer";
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }

  @ReactMethod
  private void loadModel(String path) {
    StorageService.unpack(
        context,
        path,
        "models",
        (model) -> {
          this.model = model;
        },
        (IOException exception) -> {
          this.model = null;
        });
  }

  @ReactMethod
  private void start(String grammar) throws IOException {
    stop();
    var frequency = 20000.0f;
    if (grammar != null) {
      recognizer = new Recognizer(model, frequency, grammar);
    } else {
      recognizer = new Recognizer(model, frequency);
    }

    speechService = new SpeechService(recognizer, frequency);
    speechService.startListening(new SpeechListner(context));
  }

  @ReactMethod
  public void stop() {
    cleanRecognizer();
  }

  @ReactMethod
  public void unload() {
    cleanRecognizer();
    cleanModel();
  }

  private void cleanRecognizer() {
    if (speechService != null) {
      speechService.stop();
      speechService.shutdown();
      speechService = null;
    }

    if (recognizer != null) {
      recognizer.close();
      recognizer = null;
    }
  }

  private void cleanModel() {
    if (this.model != null) {
      this.model.close();
      this.model = null;
    }
  }

  private void sendEvent(String eventName, String params) {
    context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }
}

class SpeechListner implements RecognitionListener {
  private static final String TAG = "SpeechRecognizerModule";
  final ReactApplicationContext context;

  private String lastHypothesis = "";

  SpeechListner(ReactApplicationContext context) {
    this.context = context;
  }

  @Override
  public void onResult(String hypothesis) {
    lastHypothesis = "";
    Log.v(TAG, "OnResult:" + getText(hypothesis, "text"));
  }

  @Override
  public void onFinalResult(String hypothesis) {
    lastHypothesis = "";
    Log.v(TAG, "Final:" + getText(hypothesis, "text"));
  }

  @Override
  public void onPartialResult(String hypothesis) {
    hypothesis = getText(hypothesis, "partial");

    Log.v(TAG, "onPartialResult:" + hypothesis);
    var newPartialResult = hypothesis;
    if (lastHypothesis.length() <= hypothesis.length())
      newPartialResult = hypothesis.substring(lastHypothesis.length());

    String[] words = newPartialResult.split(" ");
    for (var newWord : words) {
      if (newWord.equals(""))
        continue;
      sendEvent("onResult", newWord);
    }
    lastHypothesis = hypothesis;
  }

  @Override
  public void onError(Exception e) {
    sendEvent("onError", e.toString());
  }

  @Override
  public void onTimeout() {
    sendEvent("onTimeout", null);
  }

  private void sendEvent(String eventName, String params) {

    Log.v(TAG, "Send:" + eventName + ". Value:" + params);
    context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  private String getText(String hypothesis, String value) {
    try {
      return new JSONObject(hypothesis).getString(value);
    } catch (Exception e) {
      return "";
    }
  }
}