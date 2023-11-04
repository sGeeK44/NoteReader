package org.musictheoryteacher;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.media.AudioManager;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;

import android.os.Build;
import android.media.SoundPool;
import android.media.SoundPool.OnLoadCompleteListener;
import android.media.AudioAttributes;

public class MetronomeModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  int soundId = 1;
  SoundPool soundPool;

  ScheduledThreadPoolExecutor ex = new ScheduledThreadPoolExecutor(1);
  ScheduledFuture scheduledFuture;

  public MetronomeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  private static int toInterval(int bpm) {
    return (int) 60000 / bpm;
  }

  @ReactMethod
  public void load(String name) {
    int sound_id = this.reactContext.getResources().getIdentifier(name, "raw", this.reactContext.getPackageName());

    soundPool = new SoundPool.Builder()
        .setMaxStreams(1)
        .setAudioAttributes(new AudioAttributes.Builder()
            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
            .build())
        .build();
    soundPool.load(this.reactContext, sound_id, 1);
  }

  Runnable playSound = new Runnable() {
    @Override
    public void run() {
      soundPool.play(soundId, 1, 1, 1, 0, 1.0f);
    }
  };

  @ReactMethod
  public void play(int bpm) {
    int interval = toInterval(bpm);
    ex.setRemoveOnCancelPolicy(true);
    scheduledFuture = ex.scheduleAtFixedRate(playSound, interval, interval, TimeUnit.MILLISECONDS);
  }

  @ReactMethod
  public void stop() {
    scheduledFuture.cancel(false);
  }

  @Override
  public String getName() {
    return "Metronome";
  }
}