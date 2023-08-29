package com.notereader;

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
    if (grammar != null) {
      recognizer = new Recognizer(model, 16000.0f, grammar);
    } else {
      recognizer = new Recognizer(model, 16000.0f);
    }

    speechService = new SpeechService(recognizer, 16000.0f);
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
  final ReactApplicationContext context;

  private String lastHypothesis = "";

  SpeechListner(ReactApplicationContext context) {
    this.context = context;
  }

  @Override
  public void onResult(String hypothesis) {
    lastHypothesis = "";
  }

  @Override
  public void onFinalResult(String hypothesis) {
  }

  @Override
  public void onPartialResult(String hypothesis) {
    try {
      hypothesis = new JSONObject(hypothesis).getString("partial");
    } catch (Exception e) {
      hypothesis = "";
    }
    if (lastHypothesis.equals(hypothesis))
      return;

    lastHypothesis = hypothesis;
    String[] words = hypothesis.split(" ");
    String newWord = words[words.length - 1];
    sendEvent("onResult", newWord);
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
    context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }
}